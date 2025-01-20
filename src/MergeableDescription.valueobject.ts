'use strict';

import path from 'path';

import OASDBCException from '@src/shared/OASDBCException.js';

const MERGE_TAG_REGEX = /{% merge '.+' %}/;

export default class MergeableDescriptionVO {

    public jsonPath: string[];
    public description: string;
    public mergingFileName: string;

    private constructor(jsonPath: string[], description: string, mergingFileName: string) {
        this.jsonPath = jsonPath;
        this.description = description;
        this.mergingFileName = mergingFileName;
    }

    public static create(key: string|undefined, jsonPath: string[], node: any): MergeableDescriptionVO | null {
        if (!this.isMergeTag(key, node)) { return null; }

        // NB: The filename must be relative to project root (cwd()) or to given `mergesBasePath`.
        const match = node.match(/{% merge ['"](.+?)['"] %}/);
        const filename = match ? match[1] : null;

        if (!this.isValidMarkdownFilename(filename)) { throw new OASDBCException(`Invalid filename in "merge" tag given "${filename}".`); }

        return new MergeableDescriptionVO(jsonPath, node, filename);
    }

    private static isMergeTag(key: string | undefined, value: any): boolean {
        return key === 'description' && typeof value === 'string' && MERGE_TAG_REGEX.test(value);
    };

    private static isValidMarkdownFilename(filename: string | null | undefined) {
        return filename && filename && /^[a-zA-Z0-9._/-]+$/.test(filename) && path.extname(filename) === '.md';
    };

}