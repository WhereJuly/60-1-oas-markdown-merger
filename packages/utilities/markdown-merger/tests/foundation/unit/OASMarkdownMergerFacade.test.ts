'use strict';

import { describe, expect, it } from 'vitest';

import OASMarkdownMergerFacade from '@src/OASMarkdownMerger.facade.js';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';

describe('OASMarkdownMergerFacadeTest', () => {

    it('+static create(): Should create the expected OASMarkdownMergerFacade object', () => {
        const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();

        const actual = OASMarkdownMergerFacade.create(definitionsRetrieveService);

        expect(actual).toBeInstanceOf(OASMarkdownMergerFacade);
        expect(actual.merge).toBeInstanceOf(Function);

    });

    it('+merge() #1: Should load the definitions and assign them privately', () => {
        const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();
        const facade = OASMarkdownMergerFacade.create(definitionsRetrieveService);
        const source = './tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json';
        const destinationFile = 'dummy';

        facade.merge(source, destinationFile);

        // WRITE: How to test the merge operation actually retrieved the spec?
    });

    // Assert: internal retrieve throws 

});