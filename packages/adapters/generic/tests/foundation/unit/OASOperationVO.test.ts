'use strict';

import { describe, expect, it } from 'vitest';

import { OpenAPIV3_1 } from 'openapi-types';

import OASOperationVO from '@src/OASOperation.valueobject.js';
import { operations } from '../.ancillary/fixtures/definitions/index.js';
import { EHTTPVerb } from '@src/types.js';

describe('OASOperationVOTest', () => {

    it('+constructor() #1: Should create the expected OASOperation basic value object', () => {
        const fixture = operations['most-basic'];

        const actual = new OASOperationVO(fixture.verb as EHTTPVerb, fixture.route, fixture.operation as OpenAPIV3_1.OperationObject);

        expect(actual).toBeInstanceOf(OASOperationVO);
        expect(actual.verb).toEqual(fixture.verb);
        expect(actual.route).toEqual(fixture.route);
        expect(actual.operationID).toEqual(fixture.operation.operationId);
        expect(actual.summary).toEqual(fixture.operation.summary);
        expect(actual.description).toEqual(fixture.operation.description);
        expect(actual.tags).toEqual(fixture.operation.tags);
    });

    describe('+constructor() #2: Should generate the expected operation ID instead of missing one', () => {

        it.each(dataProvider_generate_operation_id())('Case #%# $route', (data) => {
            const fixture = structuredClone(operations['most-basic']);
            fixture.route = data.route;
            fixture.operation.operationId = undefined as any;

            const operation = new OASOperationVO(fixture.verb as EHTTPVerb, fixture.route, fixture.operation as OpenAPIV3_1.OperationObject);
            const actual = operation.operationID;

            expect(actual).toEqual(data.expected);
        });

        function dataProvider_generate_operation_id() {
            return [
                { route: '/dictionary/item/{id}/toggle-archive', expected: 'dictionaryItemToggle_archive' },
                { route: '/dictionaries/exercises/initialize', expected: 'dictionariesExercisesInitialize' },
                { route: '/diary/entry/retrieve/{date}', expected: 'diaryEntryRetrieve' },
                { route: '/diary/entry/{id}/retrieve/{date}', expected: 'diaryEntryRetrieve' }
            ];
        }

    });

    it('+constructor() #3: Should create the expected OASOperation value object (parameters, body, responses fields)', () => {
        const fixture = operations['most-basic'];

        const actual = new OASOperationVO(fixture.verb as EHTTPVerb, fixture.route, fixture.operation as OpenAPIV3_1.OperationObject);

        expect(actual.parameters).toEqual(fixture.operation.parameters);
        expect(actual.body).toEqual(fixture.operation.requestBody);
        expect(actual.responses).toEqual(fixture.operation.responses);
    });

    it('+constructor() #4: Should throw for non de-referenced operations object', () => {
        const fixture = structuredClone(operations['most-basic']);
        fixture.operation.parameters.push({ '$ref': '#/some/ref' } as any);

        const actual = () => { new OASOperationVO(fixture.verb as EHTTPVerb, fixture.route, fixture.operation as OpenAPIV3_1.OperationObject); };

        expect(actual).toThrowError('Only de-referenced operations allowed');
    });

    it('+constructor() #5: Should provide the default summary field', () => {
        const fixture = structuredClone(operations['most-basic']);
        fixture.operation.summary = undefined as any;
        
        const actual = new OASOperationVO(fixture.verb as EHTTPVerb, fixture.route, fixture.operation as OpenAPIV3_1.OperationObject);

        expect(actual.summary).toEqual(actual.operationID);
    });

});