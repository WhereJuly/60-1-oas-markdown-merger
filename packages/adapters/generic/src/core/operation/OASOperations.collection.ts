'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import OASOperationVO from './OASOperation.valueobject.js';
import { EHTTPVerb } from '../types/misc.types.js';
import OASDBCException from '@src/exceptions/OASDBCException.js';

/**
 * Represents a collection of OpenAPI operations, providing methods to retrieve and filter them.
 * 
 * The `OASOperationsCollection` processes OpenAPI path operations. 
 * It ensures that **no duplicate** `operationID`'s exists.
 * It filters operations by allowed HTTP verbs and wraps them in `OASOperationVO` instances.
 * 
 * @example
 * ```typescript
 * const operations = new OASOperationsCollection(paths);
 * console.log(operations.items); // Output: [OASOperationVO]
 * console.log(operations.findByOperationID('get_user')); // Output: OASOperationVO
 * OASOperationsCollection.isAllowedHTTPVerb('get' as EHTTPVerb); // Output: true
 * ```
 * 
 * @throws { OASDBCException } If duplicate `operationID`'s are found.
 * 
 * @group Core
 * @category Operation
 */
export default class OASOperationsCollection {

    private _items: OASOperationVO[];

    /**
     * Creates an instance of OASOperationsCollection.
     * @param {OpenAPIV3_1.PathsObject} paths
     */
    constructor(paths: OpenAPIV3_1.PathsObject) {
        this._items = [];

        Object.entries(paths)
            .flatMap(([route, operations]) => {
                return Object.entries(operations!)
                    .filter(([verb, _operation]) => OASOperationsCollection.isAllowedHTTPVerb(verb as EHTTPVerb))
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

    public static isAllowedHTTPVerb(verb: EHTTPVerb): boolean {
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
