'use strict';

import { operations, petstore } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';
import get from 'lodash.get';

import OASResponsesCollection, { TResponses } from '@src/core/operation/response/OASResponses.collection.js';
import OASResponseVO, { TCode } from '@src/core/operation/response/OASResponse.valueobject.js';
import { EHTTPStatusCodes } from '@src/core/types/http-statuses.type.js';

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

    it('+constructor() #2: Should create the expected OASResponsesCollection', () => {
        const fixture = operations['most-basic']['operation']['responses'];

        const actual = new OASResponsesCollection(fixture as TResponses);

        expect(actual).toBeInstanceOf(OASResponsesCollection);
        expect(actual.isEmpty).toEqual(false);
        expect(actual.default).toBeInstanceOf(OASResponseVO); // WRITE: Console warn when isEmpty === true 
        expect(actual.codes).toEqual([200, 400]);
        expect(actual.items.length).toEqual(2);
        expect(actual.items[0]).toBeInstanceOf(OASResponseVO);
        expect(actual.items[0]).toEqual(actual.default);
    });

    it('+get default(): Should return the explicitly defined default ', () => {
        const fixture = get(petstore, 'paths./pet.put.responses') as unknown as OpenAPIV3_1.ResponsesObject;
        expect(fixture).toBeDefined();
        const collection = new OASResponsesCollection(fixture as TResponses);

        const actual = collection.default;

        expect(actual?.code).toEqual(OASResponseVO.DEFAULT_CODE);
        expect(collection.codes).toContain(OASResponseVO.DEFAULT_CODE);
        expect(collection.items).toHaveLength(5);
    });

    describe('+findResponseByCode() Should find the response object by HTTP code | default', () => {

        it.each(dataProvider_response_by_code())('Case #%# $name', async (data) => {
            const fixture = get(petstore, 'paths./pet.put.responses') as unknown as OpenAPIV3_1.ResponsesObject;
            expect(fixture).toBeDefined();
            const collection = new OASResponsesCollection(fixture as TResponses);

            const actual = collection.findResponseByCode(data.code as TCode);

            expect(data.predicate(actual)).toEqual(true);
        });

        function dataProvider_response_by_code() {
            const found = (actual: OASResponseVO | null) => { return actual instanceof OASResponseVO; };
            const foundDefault = (actual: OASResponseVO | null) => { return actual?.code === OASResponseVO.DEFAULT_CODE; };
            const notFound = (actual: OASResponseVO | null) => { return actual === null; };

            return [
                { name: 'Found', code: EHTTPStatusCodes.SUCCESS, predicate: found },
                { name: 'Found default', code: OASResponseVO.DEFAULT_CODE, predicate: foundDefault },
                { name: 'Not found', code: 'nonExistent', predicate: notFound },
            ];
        }
    });

});