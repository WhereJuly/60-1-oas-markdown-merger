'use strict';

import { operations } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';

import OASResponsesCollection from '@src/core/operation/response/OASResponses.collection.js';

describe('OASResponsesCollectionTest', () => {

    it.only('+constructor() #1: Should create the empty OASResponsesCollection', () => {
        const actual = new OASResponsesCollection();

        expect(actual).toBeInstanceOf(OASResponsesCollection);
        expect(actual.isEmpty).toEqual(true);
        expect(actual.default).toEqual(null); // WRITE: Console warn when isEmpty === true 
        expect(actual.codes).toEqual([]);
        expect(actual.items).toEqual([]);
        expect(actual.findResponseByCode).toBeInstanceOf(Function);
    });

    // Assert findResponseByCode found / not found

});