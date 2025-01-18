'use strict';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';

export default class OASMarkdownMergerFacade {

    #definitionsRetrieveService: OASJSONDefinitionsRetrieveService;

    /**
     * NB: The class creation only available via `create` static method.
     */
    private constructor(definitionsRetrieveService: OASJSONDefinitionsRetrieveService) {
        this.#definitionsRetrieveService = definitionsRetrieveService;
    }

    public static create(definitionsRetrieveService: OASJSONDefinitionsRetrieveService): OASMarkdownMergerFacade {
        return new OASMarkdownMergerFacade(definitionsRetrieveService);
    }

}