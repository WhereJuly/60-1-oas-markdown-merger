'use strict';

import { OpenAPIV3_1 } from 'openapi-types';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';
import traverse from 'traverse';

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

        // NB: Collect mergeable descriptions.
        const descriptions = this.collectMergeableDescriptions(this.#definitions as OpenAPIV3_1.Document);

        // NB: Replace merge tags with actual content.
        descriptions.forEach(({ path, value }) => {
            
            // WRITE: Produce value to update the description field
            // - Read the merged file, throw if not exist
            // - check it is text, throw it is not
            // - translate to HTML, return HTML.
            
            const html = 'file will be here';
            const updatedValue = value.replace(/{% merge '.+' %}/, html);
            traverse(this.#definitions).set(path, updatedValue);
        });

        console.dir(descriptions);
        console.dir(this.#definitions);

        // WRITE: Save the updated document to the destination file.
    }

    private collectMergeableDescriptions(definitions: OpenAPIV3_1.Document): { path: string[]; value: string; }[] {
        const descriptions: { path: string[]; value: string; }[] = [];

        const isMergeTag = (key: string | undefined, value: any): boolean => {
            return key === 'description' && typeof value === 'string' && /{% merge '.+' %}/.test(value);
        };

        traverse(definitions).forEach(function (node) {
            if (isMergeTag(this.key, node)) { descriptions.push({ path: this.path, value: node }); }
        });

        return descriptions;
    }

}