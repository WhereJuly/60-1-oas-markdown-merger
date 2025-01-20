'use strict';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import fs from 'fs';

import OASMarkdownMergerFacade from '@src/OASMarkdownMerger.facade.js';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';

const tempDirectory = './tests/foundation/.ancillary/fixtures/.temp';

describe('OASMarkdownMergerFacadeTest', () => {

    // Ensure a clean state for written files before each test.
    beforeEach(() => {
        fs.existsSync(tempDirectory) && fs.rmSync(tempDirectory, { recursive: true, force: true });
        fs.mkdirSync(tempDirectory);
    });

    // Clean up after tests
    afterAll(() => {
        fs.existsSync(tempDirectory) && fs.rmSync(tempDirectory, { recursive: true, force: true });
    });

    it('+static create(): Should create the expected OASMarkdownMergerFacade object', () => {
        const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();

        const actual = OASMarkdownMergerFacade.create(definitionsRetrieveService);

        expect(actual).toBeInstanceOf(OASMarkdownMergerFacade);
        expect(actual.merge).toBeInstanceOf(Function);
    });

    it('+merge() #1: Should merge the definitions and save the destination file', async () => {
        // Arrange
        const source = './tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json';
        const destinationFile = `${tempDirectory}/petstore-merged.oas.json`;
        const expectedMarkdown = './tests/foundation/.ancillary/fixtures/markdown/simple.md';

        const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();
        const facade = OASMarkdownMergerFacade.create(definitionsRetrieveService);

        // Assert
        await facade.merge(source, destinationFile);
        
        const expected = fs.readFileSync(expectedMarkdown).toString('utf-8');
        const merged = fs.readFileSync(destinationFile).toString('utf-8');
        
        const actual = merged.split(`<p>${expected}</p>`).length - 1;
        
        // Act
        expect(actual).toEqual(3);
    });

    // Assert: internal retrieve throws 

});