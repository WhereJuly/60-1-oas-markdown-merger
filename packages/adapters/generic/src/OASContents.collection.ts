'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import OASMediaTypeVO from './OASMediaType.valueobject.js';
import { EMediaType } from './types.js';

/**
 * Provides and interface to a collection of OAS JSON media types.
 * 
 * @property {OASMediaTypeVO[]} items - An array of media type items content.
 * Contains the schemas and examples for each media type.
 * 
 * @property {EMediaType[] | string[]} types - An array of media type types.
 * Proxies the list of media types used in request body. Makes easier to iterate over
 * the types at consumers. E.g., when need to show the dropdown list of media types.
 * 
 * @property {boolean} isEmpty - Returns true if the collection is empty.
 */
export default class OASContentsCollection {

    public items: OASMediaTypeVO[];
    public types: EMediaType[] | string[];

    constructor(content?: OpenAPIV3_1.RequestBodyObject['content']) {
        this.items = content ? this.createItems(content) : [];
        this.types = this.items.map((item: OASMediaTypeVO) => {
            return item.type as EMediaType;
        });
    }

    public get isEmpty(): boolean {
        return this.items.length < 1;
    }

    private createItems(content: OpenAPIV3_1.RequestBodyObject['content']): OASMediaTypeVO[] {
        return Object.entries(content)
            .map(([type, definition]) => {
                return new OASMediaTypeVO(type as EMediaType, definition as OpenAPIV3_1.MediaTypeObject);
            });
    }

}