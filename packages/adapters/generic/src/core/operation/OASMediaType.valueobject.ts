'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import { EMediaType } from '../types.js';

/**
 * WRITE: Will be designed after the exploratory usage at consumer side.
 */
export default class OASMediaTypeVO {

    public type: EMediaType | string;
    public definition: OpenAPIV3_1.MediaTypeObject;

    // WRITE: Engineering the properties
    public schema: OpenAPIV3_1.SchemaObject;
    /**
     * schema: can be of types
     * - array: ArraySchemaObjectType
     * - nonarray: NonArraySchemaObjectType = 'boolean' | 'object' | 'number' | 'string' | 'integer';
     * 
     * schema properties: 
     * - type (see above);
     * - items: type SchemaObject = ArraySchemaObject | NonArraySchemaObject | MixedSchemaObject; 
     */
    
    // WRITE: Engineering the properties
    public examples: Record<string, OpenAPIV3_1.ExampleObject>;

    constructor(type: EMediaType, definition: OpenAPIV3_1.MediaTypeObject) {
        this.type = type;
        this.definition = structuredClone(definition);

        this.schema = {};
        this.examples = {};
    }

}