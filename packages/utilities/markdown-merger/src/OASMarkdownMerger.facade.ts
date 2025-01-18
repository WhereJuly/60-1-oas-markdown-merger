'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';

export default class OASMarkdownMergerFacade {

    #definitionsRetrieveService: OASJSONDefinitionsRetrieveService;
    #definitions: OpenAPIV3_1.Document | {};

    /**
     * NB: The class creation only available via `create` static method.
     */
    private constructor(definitionsRetrieveService: OASJSONDefinitionsRetrieveService) {
        this.#definitionsRetrieveService = definitionsRetrieveService;
        this.#definitions = {};
    }

    public static create(definitionsRetrieveService: OASJSONDefinitionsRetrieveService): OASMarkdownMergerFacade {
        return new OASMarkdownMergerFacade(definitionsRetrieveService);
    }

    public async merge(source: string, destinationFile: string): Promise<void> {
        this.#definitions = await this.#definitionsRetrieveService.retrieve(source);

        console.dir(this.#definitions);
    }

}