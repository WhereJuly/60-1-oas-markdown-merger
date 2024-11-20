'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import { EHTTPStatusCodes } from '@src/core/types/http-statuses.type.js';

export type TCode = EHTTPStatusCodes | typeof DEFAULT_CODE;

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

    constructor(code: TCode, definitions: OpenAPIV3_1.ResponseObject) {
        this.code = code;
    }

}