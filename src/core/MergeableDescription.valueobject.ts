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

    private mergeFileBasePath: string;
    private description: string;
    private mergingFileName: string;

    public jsonPath: string[];

    private constructor(mergeFileBasePath: string, jsonPath: string[], description: string, mergingFileName: string) {
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
     * @param {string[]} jsonPath The JSON path segments as array for to the current node in the OpenAPI document.
     * 
     * @param {any} node The value of the current OpenAPI document property being processed.
     * For `description` property may contain the merge tag.
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

    public static create(mergeFileBasePath: string, key: string | undefined, jsonPath: string[], node: any): MergeableDescriptionVO | null {
        if (!this.isMergeTag(key, node)) { return null; }

        // NB: The filename must be relative to project root (cwd()) or to given `mergesBasePath`.
        // NB: `match[1]` must not be null as it was tested above with `this.isMergeTag()`
        const filename = (node as string).match(/{% merge ['"](.+?)['"] %}/)![1];

        if (!this.isValidMarkdownFilename(filename)) { throw new OASDBCException(`Invalid filename in "merge" tag given "${filename}".`); }

        return new MergeableDescriptionVO(mergeFileBasePath, jsonPath, node as string, filename as string);
    }

    /**
     * Replaces the merge tag in the description with the sanitized HTML content
     * rendered from the corresponding markdown file.
     * 
     * @param {string} mergeFileBasePath Th base path to locate the markdown file referenced in the merge tag.
     * 
     * @returns A string containing the updated description with the merge tag replaced by the rendered HTML.
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
     * const mergeFileBasePath = './merges';
     * const updatedDescription = mergeableDescription.merged(mergeFileBasePath);
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
        return filename && filename && /^[a-zA-Z0-9._/-]+$/.test(filename) && path.extname(filename) === '.md';
    };

}