'use strict';

import OASDBCException from './exceptions/ProgressingException.js';
import { EHTTPVerb } from './types.js';

import { OpenAPIV3_1 } from 'openapi-types';

export default class OASOperationVO {

    public verb: EHTTPVerb;
    public route: string;
    public operationID: string;

    public summary: string | null;
    public description: string | null;
    public tags: string[];

    // NB: This expected to be be a de-referenced object hence no type union with OAS `ReferenceObject`. 
    public parameters: OpenAPIV3_1.ParameterObject[];

    /**
     * NB: Rename from OAS `requestBody` to `body` seems logical as `request` prefix looks redundant 
     * in the context. The `request` could be a good key to combine `parameters` and `body` into
     * a single object.
     */
    public body: OpenAPIV3_1.RequestBodyObject | {};

    // NB: This expected to be be a de-referenced object hence no type union with OAS `ReferenceObject`. 
    public responses: Record<string, OpenAPIV3_1.ResponseObject>;

    constructor(verb: EHTTPVerb, route: string, operation: OpenAPIV3_1.OperationObject) {
        this.verb = verb;
        this.route = route;

        this.operationID = operation.operationId ?? this.generateOperationID(this.route);

        this.summary = operation.summary ?? this.operationID;
        this.description = operation.description ?? null;
        this.tags = operation.tags ?? [];

        // NB: Do not accept references in operation.
        this.throwForNonDereferencedOperation(operation);

        this.parameters = operation.parameters ? structuredClone(operation.parameters as OpenAPIV3_1.ParameterObject[]) : [];
        this.body = operation.requestBody ? structuredClone(operation.requestBody) : {};
        this.responses = operation.responses ? structuredClone(operation.responses as Record<string, OpenAPIV3_1.ResponseObject>) : {};
    }

    private generateOperationID(route: string): string {
        const withoutCurly = route
            .replace(/\{[^}]*\}/g, '')
            .replace(/-/g, '_');;
        const parts = withoutCurly.split('/').filter(Boolean);
        return parts
            .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }

    private throwForNonDereferencedOperation(operation: OpenAPIV3_1.OperationObject) {
        const str = JSON.stringify(operation);
        const position = str.indexOf('$ref');

        if (position > -1) {
            const extract = str.slice(position - 50, position + 50);
            throw new OASDBCException(`Only de-referenced operations allowed. Find '$ref' nearby "${extract}".`);
        }
    }

}