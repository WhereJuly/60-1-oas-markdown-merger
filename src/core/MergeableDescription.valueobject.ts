'use strict';

import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

import OASDBCException from '@src/shared/OASDBCException.js';

const MERGE_TAG_REGEX = /{% merge '.+' %}/;

/**
 * Represents a value object to encapsulate merging descriptions in an OpenAPI document.
 * 
 * This class identifies descriptions containing special merge tags, validates associated
 * markdown file references, and provides the markdown rendered as sanitized HTML.
 */
export default class MergeableDescriptionVO {

    private readonly mergeFileBasePath: string;
    private readonly description: string;
    private readonly mergingFileName: string;

    public jsonPath: string[];

    private constructor(jsonPath: string[], description: string, mergeFileBasePath: string = '', mergingFileName: string) { // NOSONAR
        this.mergeFileBasePath = mergeFileBasePath;
        this.description = description;
        this.mergingFileName = mergingFileName;

        this.jsonPath = jsonPath;
    }

    /**
     * Factory method to create an instance of `MergeableDescriptionVO` if the provided
     * node contains a valid merge tag. If no valid merge tag is present, returns `null`.
     * 
     * @param {string | undefined} key - The key of the current JSON property being traversed.
     * For the valid mergeable description expected to be `"description"`.
     * 
     * @param {string[]} jsonPath The [JSON path segments](https://www.rfc-editor.org/rfc/rfc9535#section-1.4.2)
     * as an array for the current node in the OpenAPI document.
     * 
     * It is kept here to be used by the consumer of the {@link MergeableDescriptionVO} object to denote
     * the respective place in the parent OAS document where the merged value has to be assigned to.
     * 
     * @param {any} node The value of the current OpenAPI document property being processed.
     * For `description` property may contain the merge tag.
     * 
     * @param {string | undefined} mergeFileBasePath The optional merge file base path.
     * When omitted the process current working directory is used.
     * 
     * @returns An instance of `MergeableDescriptionVO` if the node contains a valid merge tag; otherwise, `null`.
     * 
     * @throws {OASDBCException} If the merge tag contains an invalid filename.
     * 
     * @uses {@link MergeableDescriptionVO.constructor}
     * 
     * @used by {@link OASMarkdownMergerFacade.processMergeableDescriptions}
     * 
     * @example
     * // Example usage within a traversal loop
     * const key = 'description';
     * const jsonPath = ['paths', '/example', 'get'];
     * const node = "{% merge 'example.md' %}";
     * 
     * const mergeableDescription = MergeableDescriptionVO.create(key, jsonPath, node);
     */

    public static create(key: string | undefined, jsonPath: string[], node: any, mergeFileBasePath?: string): MergeableDescriptionVO | null {
        if (!this.isMergeTag(key, node)) { return null; }

        // NB: The filename must be relative to project root (cwd()) or to given `mergesBasePath`.
        // NB: `match[1]` must not be null as it was tested above with `this.isMergeTag()`
        // const filename = (node as string).match(/{% merge ['"](.+?)['"] %}/)![1];
        const regex = RegExp(/{% merge ['"](.+?)['"] %}/);
        const filename = regex.exec(node as string)![1];

        if (!this.isValidMarkdownFilename(filename)) { throw new OASDBCException(`Invalid filename in "merge" tag given "${filename}".`); }

        return new MergeableDescriptionVO(jsonPath, node as string, mergeFileBasePath, filename as string);
    }

    /**
     * Replaces the merge tag in the description with the sanitized HTML content
     * rendered from the corresponding markdown file.
     * 
     * @returns A string containing the updated description with the merge tag 
     * replaced by the rendered HTML. The content outer to the merge tag is preserved.
     * 
     * @throws {OASDBCException} 
     * - if the markdown file referenced in the merge tag does not exist
     * - if any issues occur during file reading or HTML rendering.
     * 
     * @example
     * // Example usage of the merged method
     * const mergeableDescription = new MergeableDescriptionVO(
     *   ['paths', '/example', 'get'],
     *   "This is a {% merge 'example.md' %} description.",
     *   'example.md'
     * );
     * 
     * const updatedDescription = mergeableDescription.merged();
     * 
     * console.log(updatedDescription);
     * // Output: "This is a <sanitized HTML content> description."
     */
    public merged(): string {
        const fullPath = path.resolve(this.mergeFileBasePath, this.mergingFileName);
        if (!fs.existsSync(fullPath)) { throw new OASDBCException(`The file "${fullPath}" does not exist.`); }

        const markdown = fs.readFileSync(fullPath, 'utf-8');

        const html = this.renderHTML(markdown);

        return this.description.replace(MERGE_TAG_REGEX, html);
    }

    private renderHTML(markdown: string): string {
        const html = marked(markdown) as string;

        // WRITE: TDD sanitize HTML
        const sanitizedHTML = DOMPurify.sanitize(html);

        return sanitizedHTML;
    }

    private static isMergeTag(key: string | undefined, value: any): boolean {
        return key === 'description' && typeof value === 'string' && MERGE_TAG_REGEX.test(value);
    };

    private static isValidMarkdownFilename(filename: string | null | undefined) {
        return !!filename && filename && /^[a-zA-Z0-9._/-]+$/.test(filename) && path.extname(filename) === '.md';
    };

}