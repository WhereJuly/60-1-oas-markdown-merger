'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import path from 'path';
import fs from 'fs';
import traverse from 'traverse';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';
import OASDBCException from '@src/shared/OASDBCException.js';
import MergeableDescriptionVO from '@src/core/MergeableDescription.valueobject.js';

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
 * from 'docs/example.md' file located at `${process.cwd()}/docs` directory 
 * translated to HTML (sanitized). 
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
 * const merger = OASMarkdownMergerFacade.create('./merges');
 * 
 * // Merge the OpenAPI document from a source path and save it to a destination file
 * await merger.merge('path/to/source.json', 'path/to/destination.json');
 * ```
 */
export default class OASMarkdownMergerFacade {

    #definitionsRetrieveService: OASJSONDefinitionsRetrieveService;
    #mergesBasePath: string;

    /**
     * Creates an instance of the `OASMarkdownMergerFacade` class.
     * 
     * @param {OASJSONDefinitionsRetrieveService} definitionsRetrieveService An instance 
     * of the `OASJSONDefinitionsRetrieveService` class responsible for retrieving OpenAPI definition.
     * 
     * @param {string | undefined} mergesBasePath An optional base path for merging descriptions. 
     * @default `process.cwd()`.
     */
    constructor(definitionsRetrieveService: OASJSONDefinitionsRetrieveService, mergesBasePath?: string) {
        this.#definitionsRetrieveService = definitionsRetrieveService;
        this.#mergesBasePath = mergesBasePath ?? process.cwd();
    }

    /**
     * Factory method to create an instance of `OASMarkdownMergerFacade`.
     * 
     * Initializes the required dependencies internally, including an instance 
     * of `OASJSONDefinitionsRetrieveService`, and creates the facade with an optional base 
     * path for merging descriptions.
     * 
     * Used to simplify the facade initialization for otherwise decoupled public constructor.
     * 
     * @param {string | undefined} mergesBasePath An optional base path for merging descriptions. 
     * @default `process.cwd()`.
     * 
     * @returns An instance of `OASMarkdownMergerFacade` initialized with the required dependencies.
     * 
     * @example
     * // Creating an instance of OASMarkdownMergerFacade using the factory method
     * import OASMarkdownMergerFacade from 'path/to/OASMarkdownMergerFacade';
     * 
     * const mergesBasePath = './merges';
     * const merger = OASMarkdownMergerFacade.create(mergesBasePath);
     * 
     * // You can now use the created instance to merge OpenAPI documents
     */

    public static create(mergesBasePath?: string): OASMarkdownMergerFacade {
        const definitionsRetrieveService = new OASJSONDefinitionsRetrieveService();

        return new OASMarkdownMergerFacade(definitionsRetrieveService, mergesBasePath ?? process.cwd());
    }

    /**
     * Merges descriptions in the OpenAPI document retrieved from the specified source
     * and saves the updated document to the specified destination file.
     * 
     * This method performs the following steps:
     * 1. Retrieves the OpenAPI document from the source file.
     * 2. Processes and merges mergeable descriptions in the document.
     * 3. Saves the updated document to the destination file.
     * 
     * @param {string} source The relative file path or URL of the OpenAPI document to retrieve.
     * @param {string} destinationFile The relative path to the destination file where the merged OpenAPI
     * document will be saved.
     * 
     * The root for both `source` (when a file path) and `destinationFile` is `process.cwd()`.
     * 
     * @example
     * 
     * // Merging descriptions and saving the updated document
     * await merger.merge('path/to/source.json', 'path/to/destination.json');
     */
    public async merge(source: string, destinationFile: string): Promise<void> {
        // Retrieve the OpenAPI document from source.
        const definitions = await this.#definitionsRetrieveService.retrieve(source);

        // NB: Walk along the definitions and merge mergeable descriptions.
        this.mergeInMemory(definitions);

        // NB: Save the updated document to the destination file.
        this.writeToDestinationFile(definitions, destinationFile);
    }

    /**
     * Merges the provided OpenAPI definitions into memory by traversing and processing each node.
     * 
     * Note the method mutates {@link definitions} in-place replacing `description` fields
     * that contain "merge" tags with themselves including merged content.
     * 
     * The merged content is added into the existing `description` field content replacing
     * only the "merge" tag.
     * 
     * @param definitions - The OpenAPI document or a generic record to be merged.
     * @returns void
     */
    public mergeInMemory(definitions: OpenAPIV3_1.Document | Record<string, any>): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const facade = this;

        traverse(definitions).forEach(function (node) {
            facade.mergeIntoDefinitions(definitions, MergeableDescriptionVO.create(this.key, this.path, node, facade.#mergesBasePath));
        });
    }

    private mergeIntoDefinitions(definitions: OpenAPIV3_1.Document | Record<string, any>, mergeableDescription: MergeableDescriptionVO | null): void {
        if (!mergeableDescription) { return; }

        traverse(definitions).set(mergeableDescription.jsonPath, mergeableDescription.merged());
    }

    private writeToDestinationFile(definitions: OpenAPIV3_1.Document, destinationFile: string): void {
        const isValidDestinationFile = (filePath: string) => path.extname(filePath) === '.json' && fs.existsSync(path.dirname(filePath));

        if (!isValidDestinationFile(destinationFile)) {
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