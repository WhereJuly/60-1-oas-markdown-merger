'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import OASResponseVO, { TCode } from './OASResponse.valueobject.js';

export type TResponses = Record<string, OpenAPIV3_1.ResponseObject>;

/**
 * WRITE: Docs
 * 
 * @group Core
 * @category Operation/Content
 */
export default class OASResponsesCollection {

    private _default: OASResponseVO | null;

    public items: OASResponseVO[];
    public codes: TCode[];

    constructor(definitions?: TResponses) {
        this.items = [];
        this._default = null;
        this.codes = [];
    }

    public get isEmpty(): boolean {
        return this.items.length < 1;
    }

    public get default(): OASResponseVO | null {
        if (this.isEmpty) {
            console.warn(`OASDBCWarning: You see the warning because you try to access the default response on the empty collection. Check if the collection is empty before getting the default response.`);
        }
        return this._default;
    }

    public findResponseByCode(code: TCode): OASResponseVO | null {
        return this.items.find((item: OASResponseVO) => item.code === code) || null;
    }

}