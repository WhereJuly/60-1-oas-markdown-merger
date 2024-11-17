'use strict';

import { petstore } from '../.ancillary/fixtures/definitions/index.js';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';

import OASOperationVO from '@src/OASOperation.valueobject.js';
import OASOperationsCollection from '@src/OASOperations.collection.js';

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


});