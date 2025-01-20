'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

import OASJSONDefinitionsRetrieveService from '@src/shared/OASJSONDefinitionsRetrieve.service.js';
import traverse from 'traverse';
import OASDBCException from '@src/shared/OASDBCException.js';

type TMergeableDescription = { path: string[]; description: string; };

const MERGE_TAG_REGEX = /{% merge '.+' %}/;

export default class OASMarkdownMergerFacade {

    #definitionsRetrieveService: OASJSONDefinitionsRetrieveService;
    // #definitions: OpenAPIV3_1.Document | {};
    #basePath: string;

    /**
     * NB: The class creation only available via `create` static method.
     * WRITE: TDD with explicit basePath
     */
    private constructor(definitionsRetrieveService: OASJSONDefinitionsRetrieveService, basePath?: string) {
        this.#definitionsRetrieveService = definitionsRetrieveService;
        // this.#definitions = {};
        this.#basePath = basePath ?? process.cwd();
    }

    public static create(definitionsRetrieveService: OASJSONDefinitionsRetrieveService): OASMarkdownMergerFacade {
        return new OASMarkdownMergerFacade(definitionsRetrieveService);
    }

    public async merge(source: string, destinationFile: string): Promise<void> {
        const definitions = await this.#definitionsRetrieveService.retrieve(source);

        // NB: Collect mergeable descriptions.
        const descriptions = this.collectMergeableDescriptions(definitions);

        // NB: Replace merge tags with actual content.
        descriptions.forEach(({ path, description }) => {
            const html = this.produceHTML(description);
            const updatedValue = description.replace(MERGE_TAG_REGEX, html);
            traverse(definitions).set(path, updatedValue);
        });

        // WRITE: TDD Save the updated document to the destination file.
        this.writeToDestinationFile(definitions, destinationFile);
    }

    private collectMergeableDescriptions(definitions: OpenAPIV3_1.Document): TMergeableDescription[] {
        const isMergeTag = (key: string | undefined, value: any): boolean => {
            return key === 'description' && typeof value === 'string' && MERGE_TAG_REGEX.test(value);
        };

        const descriptions: TMergeableDescription[] = [];

        traverse(definitions).forEach(function (node) {
            if (isMergeTag(this.key, node)) { descriptions.push({ path: this.path, description: node }); }
        });

        return descriptions;
    }

    // WRITE: Produce the HTML value to update the description field with
    // - Read the merged file, throw if not exist
    // - check it is text, throw it is not
    // - translate to HTML, return HTML.
    private produceHTML(description: TMergeableDescription['description']): string {
        console.log('description: ', description);

        const isValidMarkdownFilename = (filename: string | null | undefined) => {
            return filename && filename && /^[a-zA-Z0-9._/-]+$/.test(filename) && path.extname(filename) === '.md';
        };

        // NB: The filename must be relative to project root (cwd())
        // WRITE: TDD 1) default basePath and 2) given basePath
        const match = description.match(/{% merge ['"](.+?)['"] %}/);
        const filename = match ? match[1] : null;

        // WRITE: TDD invalid filename
        if (!isValidMarkdownFilename(filename)) { throw new OASDBCException(`Invalid filename in "merge" tag given "${filename}".`); }

        // WRITE: TDD non-existent file
        const fullPath = path.resolve(this.#basePath, filename as string);
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

}