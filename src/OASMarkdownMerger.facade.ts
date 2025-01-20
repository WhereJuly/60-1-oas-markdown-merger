'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import traverse from 'traverse';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';
import OASDBCException from '@src/shared/OASDBCException.js';

type TMergeableDescription = { jsonPath: string[]; description: string; mergingFileName: string; };

const MERGE_TAG_REGEX = /{% merge '.+' %}/;

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

        // NB: Collect mergeable descriptions.
        const descriptions = this.collectMergeableDescriptions(definitions);

        // NB: Replace merge tags with actual content of merging files.
        descriptions.forEach((mergeableDescription: TMergeableDescription) => {
            this.mergeIntoDefinitions(definitions, mergeableDescription);
        });

        // NB: Save the updated document to the destination file.
        this.writeToDestinationFile(definitions, destinationFile);
    }

    private collectMergeableDescriptions(definitions: OpenAPIV3_1.Document): TMergeableDescription[] {
        const facade = this;
        const descriptions: TMergeableDescription[] = [];

        traverse(definitions).forEach(function (node) {
            const extracted = facade.extractMergeableDescription(this, node);
            extracted && descriptions.push(extracted);
        });

        return descriptions;
    }

    private extractMergeableDescription(context: traverse.TraverseContext, node: any): TMergeableDescription | null {
        if (!this.isMergeTag(context.key, node)) { return null; }

        // NB: The filename must be relative to project root (cwd()) or to given `mergesBasePath`.
        const match = node.match(/{% merge ['"](.+?)['"] %}/);
        const filename = match ? match[1] : null;

        if (!this.isValidMarkdownFilename(filename)) { throw new OASDBCException(`Invalid filename in "merge" tag given "${filename}".`); }

        return { jsonPath: context.path, description: node, mergingFileName: filename };
    }

    private mergeIntoDefinitions(definitions: OpenAPIV3_1.Document, mergeableDescription: TMergeableDescription): void {
        const html = this.translateToHTML(this.#mergesBasePath, mergeableDescription.mergingFileName);
        const updatedValue = mergeableDescription.description.replace(MERGE_TAG_REGEX, html);
        traverse(definitions).set(mergeableDescription.jsonPath, updatedValue);
    }

    // WRITE: Produce the HTML value to update the description field with
    // - Read the merged file, throw if not exist
    // - check it is text, throw it is not
    // - translate to HTML, return HTML.
    private translateToHTML(mergesBasePath: string, mergingFileName: string): string {
        const fullPath = path.resolve(mergesBasePath, mergingFileName);
        if (!fs.existsSync(fullPath)) { throw new OASDBCException(`The file "${fullPath}" does not exist.`); }

        const markdown = fs.readFileSync(fullPath, 'utf-8');
        const html = marked(markdown) as string;

        // WRITE: TDD sanitize HTML
        const sanitizedHTML = DOMPurify.sanitize(html);

        return sanitizedHTML;
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

    private isMergeTag(key: string | undefined, value: any): boolean {
        return key === 'description' && typeof value === 'string' && MERGE_TAG_REGEX.test(value);
    };

    private isValidMarkdownFilename(filename: string | null | undefined) {
        return filename && filename && /^[a-zA-Z0-9._/-]+$/.test(filename) && path.extname(filename) === '.md';
    };

}