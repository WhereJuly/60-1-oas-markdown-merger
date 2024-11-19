'use strict';

import { petstore } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';
import get from 'lodash.get';

import { EMediaType } from '@src/core/types.js';
import OASContentsCollection from '@src/core/operation/OASContents.collection.js';
import OASMediaTypeVO from '@src/core/operation/OASMediaType.valueobject.js';

describe('OASContentsCollectionTest', () => {

    it('+constructor() #1: Should create the empty OASContentsCollection ', () => {
        const actual = new OASContentsCollection();

        expect(actual).toBeInstanceOf(OASContentsCollection);
        expect(actual.items).toEqual([]);
        expect(actual.types).toEqual([]);
        expect(actual.isEmpty).toEqual(true);
    });

    it('+constructor() #2: Should create the expected OASContentsCollection', () => {
        const fixture = get(petstore, 'paths./pet.put.requestBody.content') as unknown as OpenAPIV3_1.RequestBodyObject['content'];
        expect(fixture).toBeDefined();

        const actual = new OASContentsCollection(fixture);

        expect(actual).toBeInstanceOf(OASContentsCollection);
        expect(actual.items[0]).toBeInstanceOf(OASMediaTypeVO);
        expect(actual.types[0]).toEqual(EMediaType.APPLICATION_JSON);
        expect(actual.types).toHaveLength(3);
        expect(actual.isEmpty).toEqual(false);
    });

    describe('+findType() Should find the media type object by type', () => {

        it.each(dataProvider_find_operation_by_id())('Case #%# $name', async (data) => {
            const fixture = get(petstore, 'paths./pet.put.requestBody.content') as unknown as OpenAPIV3_1.RequestBodyObject['content'];
            expect(fixture).toBeDefined();

            const collection = new OASContentsCollection(fixture);

            const actual = collection.findType(data.type);

            expect(data.predicate(actual)).toEqual(true);
        });

        function dataProvider_find_operation_by_id() {
            const foundPredicate = (actual: OASMediaTypeVO | null) => { return actual instanceof OASMediaTypeVO; };
            const notFoundPredicate = (actual: OASMediaTypeVO | null) => { return actual === null; };

            return [
                { name: 'Found', type: EMediaType.APPLICATION_XML, predicate: foundPredicate },
                { name: 'Not found', type: 'nonExistent', predicate: notFoundPredicate },
            ];
        }

    });

});