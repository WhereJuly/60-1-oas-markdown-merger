'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import OASMediaTypeVO from './OASMediaType.valueobject.js';
import { EMediaType } from './types.js';

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