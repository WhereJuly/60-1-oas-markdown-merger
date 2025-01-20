'use strict';

import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

import OASDBCException from '@src/shared/OASDBCException.js';

const MERGE_TAG_REGEX = /{% merge '.+' %}/;

export default class MergeableDescriptionVO {

    private description: string;
    private mergingFileName: string;
    
    public jsonPath: string[];

    private constructor(jsonPath: string[], description: string, mergingFileName: string) {
        this.jsonPath = jsonPath;
        this.description = description;
        this.mergingFileName = mergingFileName;
    }

    public static create(key: string | undefined, jsonPath: string[], node: any): MergeableDescriptionVO | null {
        if (!this.isMergeTag(key, node)) { return null; }

        // NB: The filename must be relative to project root (cwd()) or to given `mergesBasePath`.
        const match = node.match(/{% merge ['"](.+?)['"] %}/);
        const filename = match ? match[1] : null;

        if (!this.isValidMarkdownFilename(filename)) { throw new OASDBCException(`Invalid filename in "merge" tag given "${filename}".`); }

        return new MergeableDescriptionVO(jsonPath, node, filename);
    }

    private renderHTML(mergeFileBasePath: string): string {
        const fullPath = path.resolve(mergeFileBasePath, this.mergingFileName);
        if (!fs.existsSync(fullPath)) { throw new OASDBCException(`The file "${fullPath}" does not exist.`); }

        const markdown = fs.readFileSync(fullPath, 'utf-8');
        const html = marked(markdown) as string;

        // WRITE: TDD sanitize HTML
        const sanitizedHTML = DOMPurify.sanitize(html);

        return sanitizedHTML;
    }

    public merged(mergeFileBasePath: string): string {
        const  html =  this.renderHTML(mergeFileBasePath);

        return this.description.replace(MERGE_TAG_REGEX, html);
    }

    private static isMergeTag(key: string | undefined, value: any): boolean {
        return key === 'description' && typeof value === 'string' && MERGE_TAG_REGEX.test(value);
    };

    private static isValidMarkdownFilename(filename: string | null | undefined) {
        return filename && filename && /^[a-zA-Z0-9._/-]+$/.test(filename) && path.extname(filename) === '.md';
    };

}