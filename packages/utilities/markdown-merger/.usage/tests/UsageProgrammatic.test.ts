'use strict';

import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import fs from 'fs';

import { OASMarkdownMergerFacade } from 'oas-markdown-merger';

const root = '../tests/foundation/.ancillary/fixtures';
const tempFolder = `${root}/.temp`;
const sourceFolder = `${root}/definitions`;
const destinationFile = `${tempFolder}/petstore-merged.oas.json`;
const expectedMarkdown = `${root}/markdown/simple.md`;

describe('Programmatic Usage Test', () => {

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

    // describe('+static create(): Should create the expected OASMarkdownMergerFacade object', () => {

    //     it.each(dataProvider_merging_base_paths_1())('Case #%# $name', (data) => {
    //         const actual = OASMarkdownMergerFacade.create(data.mergesBasePath);

    //         expect(actual).toBeInstanceOf(OASMarkdownMergerFacade);
    //         expect(actual.merge).toBeInstanceOf(Function);
    //     });

    //     function dataProvider_merging_base_paths_1() {
    //         return [
    //             { name: 'With merges default base path (cwd)', mergesBasePath: undefined },
    //             { name: 'With merges custom base path', mergesBasePath: './tests/foundation/.ancillary/fixtures/markdown' },
    //         ];
    //     }

    // });

    describe('+merge(): Should successfully merge markdown files and save the destination file', () => {

        it.each(dataProvider_merging_base_paths_2())('Case #%# $name', async (data) => {
            const facade = OASMarkdownMergerFacade.create(data.mergesBasePath);

            await facade.merge(`${sourceFolder}/${data.sourceFile}`, destinationFile);

            const expected = fs.readFileSync(expectedMarkdown).toString('utf-8');
            const merged = fs.readFileSync(destinationFile).toString('utf-8');

            const actual = merged.split(`<p>${expected}</p>`).length - 1;

            expect(actual).toEqual(3);
        });

        function dataProvider_merging_base_paths_2() {
            return [
                { name: 'With merges default base path (cwd)', sourceFile: 'petstore.oas.json', mergesBasePath: '../' },
                { name: 'With merges custom base path', sourceFile: 'custom-merges-path.oas.json', mergesBasePath: `${root}/markdown` },
            ];
        }

    });

});