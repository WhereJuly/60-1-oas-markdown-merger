'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import path from 'path';
import fs from 'fs';
import traverse from 'traverse';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';
import OASDBCException from '@src/shared/OASDBCException.js';
import MergeableDescriptionVO from '@src/MergeableDescription.valueobject.js';

/**
 * A facade responsible for merging markdown files into descriptions 
 * in an OpenAPI document and saving the updated document to a specified destination file.
 * 
 * It retrieves the OpenAPI document, processes mergeable descriptions, and 
 * writes the modified document to a file.
 * 
 * @example
 * 
 * After merge The respective description in the destination JSON will contain the content
 * from 'docs/example.md' file located at project root 'docs' directory translated to HTML (sanitized). 
 * 
 * ```json
 * "description": "Some inline text\n\r{% merge './docs/example.md' %}"
 * ```
 * 
 * @example
 * 
 * Programmatic usage:
 * 
 * ```typescript
 * import OASMarkdownMergerFacade from 'path/to/OASMarkdownMergerFacade';
 * import OASJSONDefinitionsRetrieveService from 'path/to/OASJSONDefinitionsRetrieve.service.js';
 * 
 * const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();
 * const oasMarkdownMerger = OASMarkdownMergerFacade.create(definitionsRetrieveService, './merges');
 * 
 * // Merge the OpenAPI document from a source path and save it to a destination file
 * await oasMarkdownMerger.merge('path/to/source.json', 'path/to/destination.json');
 * ```
 */
export default class OASMarkdownMergerFacade {

    #definitionsRetrieveService: OASJSONDefinitionsRetrieveService;
    #mergesBasePath: string;

    /**
     * NB: The class creation only available via `create` static method.
     * 
     * The constructor is private to enforce the use of the static `create` method to ensure
     * controlled instantiation of the class with the necessary dependencies.
     */
    constructor(definitionsRetrieveService: OASJSONDefinitionsRetrieveService, mergesBasePath?: string) {
        this.#definitionsRetrieveService = definitionsRetrieveService;
        this.#mergesBasePath = mergesBasePath ?? process.cwd();
    }

    // public static create(definitionsRetrieveService: OASJSONDefinitionsRetrieveService, mergesBasePath?: string): OASMarkdownMergerFacade {
    //     return new OASMarkdownMergerFacade(definitionsRetrieveService, mergesBasePath ?? process.cwd());
    // }

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