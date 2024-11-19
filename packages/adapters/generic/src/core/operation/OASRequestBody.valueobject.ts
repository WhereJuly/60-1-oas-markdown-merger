'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import OASContentsCollection from './content/OASContents.collection.js';

/**
 * Conveniently interfaces the OAS JSON request body.
 * 
 * @property {boolean} isEmpty - Returns true if request body is empty 
 * (delegates to `OASContentsCollection`).
 * 
 */
export default class OASRequestBodyVO {

    public required: boolean;
    public description: string | null;
    public content: OASContentsCollection

    constructor(requestBody?: OpenAPIV3_1.RequestBodyObject) {
        this.required = requestBody?.required ?? false;
        this.description = requestBody?.description ?? null;
        this.content = new OASContentsCollection(requestBody?.content);
    }

    /**
     * The request body is considered empty if it does not contain any media types.
     * The getter delegates to the `isEmpty` method of the `OASContentsCollection`.
     */
    public get isEmpty(): boolean {
        return this.content.isEmpty
    }

}