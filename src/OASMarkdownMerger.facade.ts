'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import path from 'path';
import fs from 'fs';
import traverse from 'traverse';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';
import OASDBCException from '@src/shared/OASDBCException.js';
import MergeableDescriptionVO from '@src/MergeableDescription.valueobject.js';

export default class OASMarkdownMergerFacade {

    #definitionsRetrieveService: OASJSONDefinitionsRetrieveService;
    #mergesBasePath: string;

    /**
     * NB: The class creation only available via `create` static method.
     */
    private constructor(definitionsRetrieveService: OASJSONDefinitionsRetrieveService, mergesBasePath: string) {
        this.#definitionsRetrieveService = definitionsRetrieveService;
        this.#mergesBasePath = mergesBasePath;
    }

    public static create(definitionsRetrieveService: OASJSONDefinitionsRetrieveService, mergesBasePath?: string): OASMarkdownMergerFacade {
        return new OASMarkdownMergerFacade(definitionsRetrieveService, mergesBasePath ?? process.cwd());
    }

    public async merge(source: string, destinationFile: string): Promise<void> {
        // Retrieve the OpenAPI document from source.
        const definitions = await this.#definitionsRetrieveService.retrieve(source);

        // NB: Walk along the definitions and merge mergeable descriptions.
        this.processMergeableDescriptions(definitions);

        // NB: Save the updated document to the destination file.
        this.writeToDestinationFile(definitions, destinationFile);
    }

    private processMergeableDescriptions(definitions: OpenAPIV3_1.Document): void {
        const facade = this;

        traverse(definitions).forEach(function (node) {
            facade.mergeIntoDefinitions(definitions, MergeableDescriptionVO.create(this.key, this.path, node));
        });
    }

    private mergeIntoDefinitions(definitions: OpenAPIV3_1.Document, mergeableDescription: MergeableDescriptionVO | null): void {
        if (!mergeableDescription) { return; }

        traverse(definitions).set(mergeableDescription.jsonPath, mergeableDescription.merged(this.#mergesBasePath));
    }

    private writeToDestinationFile(definitions: OpenAPIV3_1.Document, destinationFile: string): void {
        const isValidJsonFilePath = (filePath: string) => path.extname(filePath) === '.json' && fs.existsSync(path.dirname(filePath));

        if (!isValidJsonFilePath(destinationFile)) {
            throw new OASDBCException(`Invalid destination file path "${destinationFile}". The destination folder must exist. The file must be a JSON file (.json).`);
        }

        try {
            fs.writeFileSync(destinationFile, JSON.stringify(definitions));
        } catch (_error) {
            const error = _error as Error;

            throw new OASDBCException(`Could not stringify and write the updated definitions to the destination file. \n\rOriginal error message: ${error.message}`, error);
        }
    }

}