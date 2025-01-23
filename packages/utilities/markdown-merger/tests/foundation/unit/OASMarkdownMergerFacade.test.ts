'use strict';

import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import fs from 'fs';

import OASMarkdownMergerFacade from '@src/core/OASMarkdownMerger.facade.js';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';

const root = '../tests/foundation/.ancillary/fixtures';
const tempFolder = `${root}/.temp`;
const sourceFolder = `${root}/definitions`;
const destinationFile = `${tempFolder}/petstore-merged.oas.json`;
const expectedMarkdown = `${root}/markdown/simple.md`;
const mergesBasePath = `${root}/markdown`;

const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();

describe('OASMarkdownMergerFacadeTest', () => {

    // Ensure a clean state for written files before each test.
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        fs.existsSync(tempFolder) && fs.rmSync(tempFolder, { recursive: true, force: true });
        fs.mkdirSync(tempFolder);
    });

    // Clean up after tests
    afterAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        fs.existsSync(tempFolder) && fs.rmSync(tempFolder, { recursive: true, force: true });
    });

    it('+constructor(): Should create the expected OASMarkdownMergerFacade object', () => {
        const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();

        const actual = new OASMarkdownMergerFacade(definitionsRetrieveService);

        expect(actual).toBeInstanceOf(OASMarkdownMergerFacade);
        expect(actual.merge).toBeInstanceOf(Function);
    });

    describe('+static create(): Should create the expected OASMarkdownMergerFacade object', () => {

        it.each(dataProvider_merging_base_paths_1())('Case #%# $name', (data) => {
            const actual = OASMarkdownMergerFacade.create(data.mergesBasePath);

            expect(actual).toBeInstanceOf(OASMarkdownMergerFacade);
            expect(actual.merge).toBeInstanceOf(Function);
        });

        function dataProvider_merging_base_paths_1() {
            return [
                { name: 'With merges default base path (cwd)', mergesBasePath: undefined },
                { name: 'With merges custom base path', mergesBasePath: mergesBasePath },
            ];
        }

    });

    describe('+merge() #1: Should successfully merge markdown files and save the destination file', () => {

        it.each(dataProvider_merging_base_paths_2())('Case #%# $name', async (data) => {
            const facade = new OASMarkdownMergerFacade(definitionsRetrieveService, data.mergesBasePath);

            await facade.merge(`${sourceFolder}/${data.sourceFile}`, destinationFile);

            const expected = fs.readFileSync(expectedMarkdown).toString('utf-8');
            const merged = fs.readFileSync(destinationFile).toString('utf-8');

            const actual = merged.split(`<p>${expected}</p>`).length - 1;

            expect(actual).toEqual(3);
        });

        function dataProvider_merging_base_paths_2() {
            return [
                { name: 'With merges default base path (cwd)', sourceFile: 'petstore.oas.json', mergesBasePath: undefined },
                { name: 'With merges custom base path', sourceFile: 'custom-merges-path.oas.json', mergesBasePath: './tests/foundation/.ancillary/fixtures/markdown' },
            ];
        }

    });

    describe('+merge() #2: Should throw for non-existent source file', () => {

        it.each(dataProvider_invalid_source())('Case #%# $name', async (data) => {
            const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();
            const facade = new OASMarkdownMergerFacade(definitionsRetrieveService);

            const actual = async () => { await facade.merge(`${sourceFolder}/${data.filename}`, 'missing output dummy'); };

            await expect(() => actual()).rejects.toThrowError(data.errorContains);
        });

        function dataProvider_invalid_source() {
            return [
                { name: 'No ".json" extension', filename: 'some/no-extension', errorContains: 'must have a \'.json\' extension' },
                { name: 'Not an existing file', filename: 'some/nonexistent.json', errorContains: 'does not exist' },
            ];
        }

    });

    describe('+merge() #3: Should throw for invalid destination file name', () => {

        it.each(dataProvider_invalid_destination_file())('Case #%# $name', async (data) => {
            const facade = new OASMarkdownMergerFacade(definitionsRetrieveService);

            const actual = async () => {
                await facade.merge(`${sourceFolder}/petstore.oas.json`, data.destination);
            };

            await expect(() => actual()).rejects.toThrowError('Invalid destination');
        });

        function dataProvider_invalid_destination_file() {
            return [
                { name: 'Non-existent folder', destination: 'non-existent-folder' },
                { name: 'Does not have .json extension', destination: `${tempFolder}/no-json-extension` },
            ];
        }

    });

    describe('+merge() #4: Should throw for invalid or non-existent merged file', () => {

        it.each(dataProvider_non_valid_merged_file_names())('Case #%# $name', async (data) => {
            const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();
            const facade = new OASMarkdownMergerFacade(definitionsRetrieveService);

            const actual = async () => { await facade.merge(`${sourceFolder}/${data.filename}`, 'missing output dummy'); };

            await expect(() => actual()).rejects.toThrowError(data.errorContains);
        });

        function dataProvider_non_valid_merged_file_names() {
            return [
                { name: 'No ".md" extension', filename: 'invalid-merged-file-name.oas.json', errorContains: 'Invalid filename in "merge" tag given' },
                { name: 'Not an existing merging file', filename: 'non-existent-merged-file-name.oas.json', errorContains: 'valid-nonexistent.md" does not exist' },
            ];
        }

    });

    describe('+mergeInMemory(): Should process arbitrary JSON in memory', () => {

        it('Should successfully merge the file', () => {
            const facade = OASMarkdownMergerFacade.create(mergesBasePath);

            

        });

    });

});