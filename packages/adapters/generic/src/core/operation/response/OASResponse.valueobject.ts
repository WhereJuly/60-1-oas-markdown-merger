'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import { EHTTPStatusCodes } from '@src/core/types/http-statuses.type.js';
import OASContentsCollection from '../content/OASContents.collection.js';

export type TCode = EHTTPStatusCodes | typeof DEFAULT_CODE;

// WRITE: Replace with OASHeadersCollection and OASLinksCollection
type THeaders = { [header: string]: OpenAPIV3_1.HeaderObject; };
type TLinks = { [link: string]: OpenAPIV3_1.LinkObject; };

const DEFAULT_CODE = 'default';

/**
 * WRITE: Docs
 * 
 * @group Core
 * @category Operation/Content
 */
export default class OASResponseVO {

    public static DEFAULT_CODE = DEFAULT_CODE;

    public code: TCode;
    public description: string;
    public headers: THeaders;
    public content: OASContentsCollection;
    public links: TLinks;

    constructor(code: TCode, definitions: OpenAPIV3_1.ResponseObject) {
        this.code = code;
        this.description = definitions.description;
        this.headers = definitions.headers || {};
        this.content = new OASContentsCollection(definitions.content);
        this.links = definitions.links || {};
    }

}