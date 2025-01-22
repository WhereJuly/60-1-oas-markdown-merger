'use strict';

import { container, singleton, type InjectionToken } from 'tsyringe';
import type { OpenAPIV3_1 } from 'openapi-types';

import { OASOperationsCollection } from '@dcoupld/oas-generic-adapter';

/**
 * The OAS JSON Definitions instance DI container injection token.
 * 
 * @group LooksAdapter
 * @category DI Container
 */
type TOASJSONDefinitions = InjectionToken<OpenAPIV3_1.Document>;
export const DEFINITIONS: TOASJSONDefinitions = Symbol('DEFINITIONS');

/**
 * The OAS Operations Collection instance DI container injection token.
 * 
 * @group LooksAdapter
 * @category DI Container
 */
type TOASOperationsCollection = InjectionToken<OASOperationsCollection>;
export const OPERATIONS_COLLECTION: TOASOperationsCollection = Symbol('OPERATIONS_COLLECTION');

export default class AdapterBootstrapService {

    constructor(definitions: OpenAPIV3_1.Document) {
        console.log('in looks adapter bootstrap service...');

        container.register(DEFINITIONS, { useValue: definitions });

        const operations = new OASOperationsCollection(definitions.paths as OpenAPIV3_1.PathsObject);
        container.register(OPERATIONS_COLLECTION, { useValue: operations });
    }

}