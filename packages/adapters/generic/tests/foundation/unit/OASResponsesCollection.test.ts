'use strict';

import { operations } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';

import OASResponsesCollection from '@src/core/operation/response/OASResponses.collection.js';
import OASResponseVO from '@src/core/operation/response/OASResponse.valueobject.js';

describe('OASResponsesCollectionTest', () => {

    it('+constructor() #1: Should create the empty OASResponsesCollection', () => {
        const actual = new OASResponsesCollection();

        expect(actual).toBeInstanceOf(OASResponsesCollection);
        expect(actual.isEmpty).toEqual(true);
        expect(actual.default).toEqual(null); // WRITE: Console warn when isEmpty === true 
        expect(actual.codes).toEqual([]);
        expect(actual.items).toEqual([]);
        expect(actual.findResponseByCode).toBeInstanceOf(Function);
    });

    it('+constructor() #1: Should create the expected OASResponsesCollection', () => {
        const actual = new OASResponsesCollection();

        expect(actual).toBeInstanceOf(OASResponsesCollection);
        expect(actual.isEmpty).toEqual(false);
        expect(actual.default).toBeInstanceOf(OASResponseVO); // WRITE: Console warn when isEmpty === true 
        expect(actual.codes).toEqual(['default', '200', '404', '500']);
        expect(actual.items.length).toEqual(1);
        expect(actual.items[0]).toBeInstanceOf(OASResponseVO);
    });
    
    // expect(actual.findResponseByCode).toBeInstanceOf(Function);
    // Assert findResponseByCode found / not found

});