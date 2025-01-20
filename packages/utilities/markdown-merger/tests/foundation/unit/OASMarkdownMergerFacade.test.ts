'use strict';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import fs from 'fs';

import OASMarkdownMergerFacade from '@src/OASMarkdownMerger.facade.js';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';

const tempFolder = './tests/foundation/.ancillary/fixtures/.temp';

const sourceFolder = './tests/foundation/.ancillary/fixtures/definitions';
const source = './tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json';
const destinationFile = `${tempFolder}/petstore-merged.oas.json`;
const expectedMarkdown = './tests/foundation/.ancillary/fixtures/markdown/simple.md';

const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();

describe('OASMarkdownMergerFacadeTest', () => {

    // Ensure a clean state for written files before each test.
    beforeEach(() => {
        fs.existsSync(tempFolder) && fs.rmSync(tempFolder, { recursive: true, force: true });
        fs.mkdirSync(tempFolder);
    });

    // Clean up after tests
    afterAll(() => {
        fs.existsSync(tempFolder) && fs.rmSync(tempFolder, { recursive: true, force: true });
    });

    it('+static create(): Should create the expected OASMarkdownMergerFacade object', () => {
        const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();

        const actual = OASMarkdownMergerFacade.create(definitionsRetrieveService);

        expect(actual).toBeInstanceOf(OASMarkdownMergerFacade);
        expect(actual.merge).toBeInstanceOf(Function);
    });

    describe('+merge() #1: Should successfully merge markdown files and save the destination file', async () => {

        it.each(dataProvider_merging_base_paths())('Case #%# $name', async (data) => {
            const facade = OASMarkdownMergerFacade.create(definitionsRetrieveService, data.mergedBasePath);

            await facade.merge(`${sourceFolder}/${data.sourceFile}`, destinationFile);

            const expected = fs.readFileSync(expectedMarkdown).toString('utf-8');
            const merged = fs.readFileSync(destinationFile).toString('utf-8');

            const actual = merged.split(`<p>${expected}</p>`).length - 1;

            expect(actual).toEqual(3);
        });

        function dataProvider_merging_base_paths() {
            return [
                { name: 'With merges default base path (cwd)', sourceFile: 'petstore.oas.json', mergedBasePath: undefined },
                { name: 'With merges custom base path', sourceFile: 'custom-merges-path.oas.json', mergedBasePath: './tests/foundation/.ancillary/fixtures/markdown' },
            ];
        }

    });

    describe('+merge() #2: Should throw for non-existent source file', () => {

        it.each(dataProvider_invalid_source())('Case #%# $name', async (data) => {
            const source = './tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json';

            const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();
            const facade = OASMarkdownMergerFacade.create(definitionsRetrieveService);

            const actual = async () => { await facade.merge(data.filename, 'missing output dummy'); };

            await expect(() => actual()).rejects.toThrowError(data.errorContains);
        });

        function dataProvider_invalid_source() {
            return [
                { name: 'No ".json" extension', filename: 'some/no-extension', errorContains: 'must have a \'.json\' extension' },
                { name: 'Not an existing file', filename: 'some/nonexistent.json', errorContains: 'does not exist' },
            ];
        }

    });

});