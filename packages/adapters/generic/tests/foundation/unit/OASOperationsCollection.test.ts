'use strict';

import { petstore } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';

import OASOperationsCollection from '@src/core/operation/OASOperations.collection.js';
import OASOperationVO from '@src/core/operation/OASOperation.valueobject.js';

describe('OASOperationsCollectionTest', () => {

    it('+constructor() #1: Should create the empty OASOperationsCollection', () => {
        const actual = new OASOperationsCollection({});

        expect(actual).toBeInstanceOf(OASOperationsCollection);
        expect(actual.items).toBeInstanceOf(Array);
        expect(actual.items).toHaveLength(0);
    });

    it('+constructor() #2: Should create the expected OASOperationsCollection from "petstore" definitions', () => {
        const fixture = petstore['paths'] as OpenAPIV3_1.PathsObject;

        const actual = new OASOperationsCollection(fixture);

        expect(actual.items).toBeInstanceOf(Array);
        expect(actual.items).toHaveLength(19);
        expect(actual.items[0]).toBeInstanceOf(OASOperationVO);
    });

    it('+constructor() #3: Throws for non-unique operation ID', () => {
        const fixture = structuredClone(petstore['paths'] as OpenAPIV3_1.PathsObject);
        // Mock the duplicate operation ID
        fixture['/pet']!['put']!['operationId'] = 'addPet';

        const actual = () => { new OASOperationsCollection(fixture); };

        expect(actual).toThrowError('Found unexpected duplicate operation');
    });

    describe('+findByOperationID() Should retrieve the operation', () => {

        it.each(dataProvider_find_operation_by_id())('Case #%# $name', async (data) => {
            const fixture = petstore['paths'] as OpenAPIV3_1.PathsObject;
            const collection = new OASOperationsCollection(fixture);

            const actual = collection.findByOperationID(data.operation);

            expect(data.predicate(actual)).toEqual(true);
        });

        function dataProvider_find_operation_by_id() {
            const foundPredicate = (actual: OASOperationVO | null) => { return actual instanceof OASOperationVO; };
            const notFoundPredicate = (actual: OASOperationVO | null) => { return actual === null; };
            
            return [
                { name: 'Found', operation: 'addPet', predicate: foundPredicate },
                { name: 'Not found', operation: 'nonExistent', predicate: notFoundPredicate },
            ];
        }

    });

});