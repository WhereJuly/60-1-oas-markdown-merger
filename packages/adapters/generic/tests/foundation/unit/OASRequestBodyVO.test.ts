'use strict';

import { operations } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';

import OASRequestBodyVO from '@src/core/operation/OASRequestBody.valueobject.js';
import OASContentsCollection from '@src/core/operation/content/OASContents.collection.js';

describe('OASRequestBodyVOTest', () => {

    it('+constructor() #1: Should create the OASRequestBodyVO value null-object', () => {
        const actual = new OASRequestBodyVO();

        expect(actual).toBeInstanceOf(OASRequestBodyVO);
        expect(actual.required).toEqual(false);
        expect(actual.description).toEqual(null);
        expect(actual.isEmpty).toEqual(true);
        expect(actual.content).toBeInstanceOf(OASContentsCollection); 
    });

    it('+constructor() #2: Should create the expected OASRequestBodyVO value object', () => {
        const fixture = operations['most-basic']['operation']['requestBody'];

        const actual = new OASRequestBodyVO(fixture as OpenAPIV3_1.RequestBodyObject);

        expect(actual).toBeInstanceOf(OASRequestBodyVO);
        expect(actual.required).toEqual(fixture.required);
        expect(actual.description).toEqual(fixture.description);
        expect(actual.isEmpty).toEqual(false);
        expect(actual.content).toBeInstanceOf(OASContentsCollection); 
    });

});