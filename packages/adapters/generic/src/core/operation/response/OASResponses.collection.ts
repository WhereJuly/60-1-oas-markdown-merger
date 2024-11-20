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

        // NB: Early return to not manage undefined definitions at initialization.
        if (!definitions) { return; }

        this.initialize(definitions);
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

    /**
     * Initialize the OASResponsesCollection with the provided response definitions.
     * 
     * This method processes each response definition, creates OASResponseVO objects,
     * and populates the collection's items and codes. It also sets the default response.
     * 
     * @param {TResponses} definitions - An object containing response definitions keyed 
     * by status codes. The keys can be string representations of HTTP status codes or 'default'.
     * 
     * @returns void - This method doesn't return a value but updates the internal state of the collection.
     */
    private initialize(definitions: TResponses): void {
        Object.entries(definitions).forEach(([code, definition]) => {
            const codeNormalized = (code === OASResponseVO.DEFAULT_CODE ? OASResponseVO.DEFAULT_CODE : parseInt(code, 10)) as TCode;
            this.items.push(new OASResponseVO(codeNormalized, definition as OpenAPIV3_1.ResponseObject));
            this.codes.push(codeNormalized);
        });

        this._default = this.isEmpty ? null : (this.findResponseByCode('default') ?? this.items[0]!);
    }

}