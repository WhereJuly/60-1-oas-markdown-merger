'use strict';

import { operations, petstore } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';
import get from 'lodash.get';

import OASContentsCollection from '@src/core/operation/content/OASContents.collection.js';
import OASResponseVO from '@src/core/operation/response/OASResponse.valueobject.js';
import { EMediaType } from '@src/core/types/misc.types.js';

describe('OASResponseVOTest', () => {

    it('+constructor() #1: Should create the expected OASResponseVO object', () => {
        const fixture = operations['most-basic']['operation']['responses']['200'];

        const actual = new OASResponseVO(200, fixture as OpenAPIV3_1.ResponseObject);

        expect(actual).toBeInstanceOf(OASResponseVO);
        expect(actual.description).toEqual('The user girths entries list.');
        expect(actual.code).toEqual(200);
        expect(actual.headers).toEqual({});
        expect(actual.links).toEqual({});
        expect(actual.content).toBeInstanceOf(OASContentsCollection);
        expect(actual.content.types).toEqual([EMediaType.APPLICATION_JSON]);
    });

    it('+constructor() #2: Should create the expected OASResponseVO object from different fixture', () => {
        const fixture = get(petstore, 'paths./pet.put.responses.200') as unknown as OpenAPIV3_1.ResponseObject;

        const actual = new OASResponseVO(200, fixture);

        expect(actual.description).toEqual('Successful operation');
        expect(actual.code).toEqual(200);
        expect(actual.headers).toEqual({});
        expect(actual.links).toEqual({});
        expect(actual.content.types).toEqual([EMediaType.APPLICATION_JSON, EMediaType.APPLICATION_XML]);
    });

});