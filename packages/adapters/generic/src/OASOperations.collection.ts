'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import OASOperationVO from './OASOperation.valueobject.js';
import { EHTTPVerb } from './types.js';

export default class OASOperationsCollection {

    private _items: OASOperationVO[];

    constructor(paths: OpenAPIV3_1.PathsObject) {
        this._items = [];

        Object.entries(paths)
            .flatMap(([route, operations]) => {
                return Object.entries(operations!)
                    .filter(([verb, _operation]) => RawOperationVO.isAllowedHTTPVerb(verb))
                    .map(([verb, operation]) => (new RawOperationVO(verb as EHTTPVerb, route, operation as OpenAPIV3_1.OperationObject)));
            })
            .forEach((rawOperation: RawOperationVO) => {
                this._items.push(new OASOperationVO(rawOperation.verb, rawOperation.route, rawOperation.operation));
            });
    }

    public get items(): OASOperationVO[] {
        return this._items;
    }

}

class RawOperationVO {

    public verb: EHTTPVerb;
    public route: string;
    public operation: OpenAPIV3_1.OperationObject;

    constructor(verb: EHTTPVerb, route: string, operation: OpenAPIV3_1.OperationObject) {
        this.verb = verb;
        this.route = route;
        this.operation = structuredClone(operation);
    }

    public static isAllowedHTTPVerb(verb: string): boolean {
        const allowed = Object.values(EHTTPVerb).map((verb: EHTTPVerb) => { return verb.toLowerCase(); });
        return allowed.includes(verb.toLowerCase());
    }
}