'use strict';

import { EHTTPStatusCodes } from '@src/core/types/http-statuses.type.js';

export type TCode = EHTTPStatusCodes | 'default';

export default class OASResponseVO {

    public code: TCode;

    constructor() {
        this.code = 'default';
    }

}