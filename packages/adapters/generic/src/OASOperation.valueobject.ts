'use strict';

import { EHTTPVerb } from './types.js';

import { OpenAPIV3_1 } from 'openapi-types';

export default class OASOperationVO {

    public verb: EHTTPVerb;
    public route: string;
    public operationID: string;

    public summary: string | null;
    public description: string | null;
    public tags: string[];

    constructor(verb: EHTTPVerb, route: string, operation: OpenAPIV3_1.OperationObject) {
        this.verb = verb;
        this.route = route;

        this.operationID = operation.operationId ?? this.generateOperationID(this.route);

        this.summary = operation.summary ?? null;
        this.description = operation.description ?? null;
        this.tags = operation.tags ?? [];
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

}