'use strict';

import { OpenAPIV3_1 } from 'openapi-types';
import path from 'path';

import OASDBCException from './exceptions/ProgressingException.js';
import { accessSync, constants } from 'fs';
import { readFile } from 'fs/promises';

type TActualRetrieveReturnType = Promise<string>;

export default class OASJSONDefinitionsRetrieveService {

    constructor() {

    }

    public async retrieve(source: string): Promise<OpenAPIV3_1.Document> {
        const isURL = this.isURL(source);
        const isLocalFile = this.isLocalFile(source);

        if (!isURL && !isLocalFile) {
            throw new OASDBCException(`The source "${source}" must either be a local file (relative or absolute path) with '.json' extension or a valid URL.`);
        }

        const actualRetrieveMethod = this.getActualRetrieveMethod(isURL);
        const content = await actualRetrieveMethod(source);

        const json = this.parseOrThrow(content);
        return this.getValidOASDefinitionsOrThrow(json);
    }

    private isURL(url: string): boolean {
        return URL.canParse(url);
    }

    private isLocalFile(filePath: string): boolean {
        const absoluteFilePath = this.getAbsoluteFilePath(filePath);
        const isJSONExtension = path.extname(absoluteFilePath) === '.json';

        if (!isJSONExtension) {
            throw new OASDBCException(`The file "${filePath}" must have a '.json' extension.`);
        }

        this.checkFileExistsOrThrow(absoluteFilePath);

        return true;
    }

    private getAbsoluteFilePath(filePath: string): string {
        return path.isAbsolute(filePath) ? filePath : path.resolve(filePath);
    }

    private checkFileExistsOrThrow(absoluteFilePath: string): true {
        try {
            accessSync(absoluteFilePath, constants.R_OK);
            return true;
        } catch (err) {
            throw new OASDBCException(`The file "${absoluteFilePath}" does not exist.`);
        }
    }

    private getActualRetrieveMethod(isURL: boolean): (source: string) => TActualRetrieveReturnType {
        return isURL ? this.retrieveRemote : this.retrieveLocal;
    }

    private async retrieveLocal(absoluteFilePath: string): TActualRetrieveReturnType {
        return await readFile(absoluteFilePath, 'utf-8');
    }

    private async retrieveRemote(): TActualRetrieveReturnType {
        return await new Promise(() => { return true; });
    }

    private parseOrThrow(content: string | Record<string, any>): OpenAPIV3_1.Document {
        try {
            return this.isJSONString(content) ? JSON.parse(content as string) : content;
        } catch (_err) {
            const error = _err as Error;
            throw new OASDBCException('Could not parse the given content.', error);
        }
    }

    private getValidOASDefinitionsOrThrow(json: OpenAPIV3_1.Document): OpenAPIV3_1.Document {
        if (json.openapi !== '3.1.0') {
            const extract = JSON.stringify(json).slice(0, 20);
            throw new OASDBCException(`The given json "${extract}" is not a valid OpenAPI v.3.1 document`);
        }
        return json;
    }

    private isJSONString(value: unknown): boolean {
        const isString = typeof value === 'string';
        return isString && value.length >= 2; // NB: Meaning '{}'|'[]' are the shortest valid JSON string. 
    }

}