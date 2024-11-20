'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import { EMediaType } from '../../types/misc.types.js';
import OASMediaTypeVO from './OASMediaType.valueobject.js';

export type TContent = { [media: string]: OpenAPIV3_1.MediaTypeObject; };

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
 * 
 * @group Core
 * @category Operation/Content
 */
export default class OASContentsCollection {

    public items: OASMediaTypeVO[];
    public types: EMediaType[] | string[];

    constructor(content?: TContent) {
        this.items = content ? this.createItems(content) : [];
        this.types = this.items.map((item: OASMediaTypeVO) => {
            return item.type as EMediaType | string;
        });
    }

    public get isEmpty(): boolean {
        return this.items.length < 1;
    }

    public findType(type: EMediaType | string): OASMediaTypeVO | null {
        const found = this.items.find((item: OASMediaTypeVO) => { return item.type === type; });

        return found ? found : null;
    }

    private createItems(content: TContent): OASMediaTypeVO[] {
        return Object.entries(content)
            .map(([type, definition]) => {
                return new OASMediaTypeVO(type as EMediaType, definition as OpenAPIV3_1.MediaTypeObject);
            });
    }

}