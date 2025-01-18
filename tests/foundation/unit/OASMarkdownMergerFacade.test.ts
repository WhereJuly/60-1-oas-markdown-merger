'use strict';

import { describe, expect, it } from 'vitest';

import OASMarkdownMergerFacade from '@src/OASMarkdownMerger.facade.js';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';

describe('OASMarkdownMergerFacadeTest', () => {

    it('+static create() #1: Should create the expected OASMarkdownMergerFacade object', () => {
        const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();

        const actual = OASMarkdownMergerFacade.create(definitionsRetrieveService);

        expect(actual).toBeInstanceOf(OASMarkdownMergerFacade);
    });

});