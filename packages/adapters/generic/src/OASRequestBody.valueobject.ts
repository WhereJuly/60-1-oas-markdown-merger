'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import OASContentsCollection from './OASContents.collection.js';

export default class OASRequestBodyVO {

    public required: boolean;
    public description: string | null;
    public content: OASContentsCollection

    constructor(requestBody?: OpenAPIV3_1.RequestBodyObject) {
        this.required = requestBody?.required ?? false;
        this.description = requestBody?.description ?? null;
        this.content = new OASContentsCollection(requestBody?.content);
    }

    public get isEmpty(): boolean {
        return this.content.isEmpty
    }

}