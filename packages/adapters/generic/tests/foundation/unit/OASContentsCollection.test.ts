'use strict';

import { operations } from '../.ancillary/fixtures/definitions/index.js';
import { petstore } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';

import OASContentsCollection from '@src/OASContents.collection.js';
import { EMediaType } from '@src/types.js';
import OASMediaTypeVO from '@src/OASMediaType.valueobject.js';
import get from 'lodash.get';

describe('OASContentsCollectionTest', () => {

    it('+constructor() #1: Should create the empty OASContentsCollection ', () => {
        const actual = new OASContentsCollection();

        expect(actual).toBeInstanceOf(OASContentsCollection);
        expect(actual.items).toEqual([]);
        expect(actual.types).toEqual([]);
        expect(actual.isEmpty).toEqual(true);
    });

    it('+constructor() #2: Should create the expected OASContentsCollection', () => {
        const fixture = get(petstore, 'paths./pet.put.requestBody.content') as unknown as OpenAPIV3_1.MediaTypeObject;
        expect(fixture).toBeDefined();

        const actual = new OASContentsCollection(fixture as OpenAPIV3_1.RequestBodyObject['content']);

        expect(actual).toBeInstanceOf(OASContentsCollection);
        expect(actual.items[0]).toBeInstanceOf(OASMediaTypeVO);
        expect(actual.types[0]).toEqual(EMediaType.APPLICATION_JSON);
        expect(actual.types).toHaveLength(3);
        expect(actual.isEmpty).toEqual(false);
    });

});