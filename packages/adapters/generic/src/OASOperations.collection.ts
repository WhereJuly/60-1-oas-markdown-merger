'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import OASOperationVO from './OASOperation.valueobject.js';
import { EHTTPVerb } from './types.js';
import OASDBCException from './exceptions/ProgressingException.js';

/**
 * Represents a collection of OpenAPI operations, providing methods to retrieve and filter them.
 * 
 * The `OASOperationsCollection` processes OpenAPI path operations. It ensures that no duplicate
 * `operationID` exists. It filters operations by allowed HTTP verbs and wraps them
 *  in `OASOperationVO` instances.
 */
export default class OASOperationsCollection {

    private _items: OASOperationVO[];

    constructor(paths: OpenAPIV3_1.PathsObject) {
        this._items = [];

        Object.entries(paths)
            .flatMap(([route, operations]) => {
                return Object.entries(operations!)
                    .filter(([verb, _operation]) => OASOperationsCollection.isAllowedHTTPVerb(verb))
                    // .map(([verb, operation]) => (new RawOperationVO(verb as EHTTPVerb, route, operation as OpenAPIV3_1.OperationObject)));
                    .forEach(([verb, operation]) => {
                        this._items.push(new OASOperationVO(verb as EHTTPVerb, route, operation as OpenAPIV3_1.OperationObject));
                    });
            });

        this.throwForDuplicateOperationIDs();
    }

    public get items(): OASOperationVO[] {
        return this._items;
    }

    public findByOperationID(operationID: string): OASOperationVO | null {
        return this._items.find((item: OASOperationVO) => item.operationID === operationID) || null;
    }

    public static isAllowedHTTPVerb(verb: string): boolean {
        const allowed = Object.values(EHTTPVerb).map((verb: EHTTPVerb) => { return verb.toLowerCase(); });
        return allowed.includes(verb.toLowerCase());
    }

    private throwForDuplicateOperationIDs() {
        const counts = new Map<any, number>();

        this._items.forEach((item: OASOperationVO) => {
            counts.set(item.operationID, (counts.get(item.operationID) || 0) + 1);
        });

        const duplicates = [...counts].filter(([_key, value]) => value > 1);

        if (duplicates.length > 0) {
            throw new OASDBCException(`Found unexpected duplicate operation IDs: "${duplicates.toString()}". Please rename operationID's to remove duplicates.`);
        }
    }

}
