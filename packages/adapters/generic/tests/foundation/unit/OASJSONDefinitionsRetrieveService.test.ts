'use strict';

import { valid_oas } from '@fixtures/definitions/index.js';

import { afterEach, describe, expect, it, vi } from 'vitest';
import nock from 'nock';

import OASJSONDefinitionsRetrieveService from '@src/OASJSONDefinitionsRetrieve.service.js';

const filename = './tests/foundation/.ancillary/fixtures/definitions/valid-oas.json';
const url = 'http://127.0.0.1:5000/json/valid';

const server = nock('http://127.0.0.1:5000');

describe('[Unit] OASJSONDefinitionsRetrieveServiceTest', () => {

    afterEach(() => {
        nock.cleanAll();
    });

    it('+constructor(): Should create OASJSONDefinitionsRetrieveService expected object', () => {
        const actual = new OASJSONDefinitionsRetrieveService();

        expect(actual).toBeInstanceOf(OASJSONDefinitionsRetrieveService);
        expect(actual.retrieve).toBeInstanceOf(Function);
    });

    describe('+retrieve() #1: Should retrieve definitions from local file or remote url', () => {

        it('Should retrieve local file successfully', async () => {
            const fixture = valid_oas;
            const service = new OASJSONDefinitionsRetrieveService();

            const actual = await service.retrieve(filename);

            expect(actual).toEqual(fixture);
        });

        it('Should retrieve JSON from remote url successfully', async () => {
            const fixture = valid_oas;
            const service = new OASJSONDefinitionsRetrieveService();

            server.get('/json/valid').reply(200, fixture);

            const actual = await service.retrieve(url);

            expect(actual).toEqual(fixture);
        });

        // ERRORS:
        // WRITE: Assert retrieve throws for non-existent URL (404)
        // WRITE: Assert throws for network error
        // WRITE: Assert throws invalid OAS JSON

    });

    describe('+retrieve() #2: Should fail for local file name', () => {

        it.each(dataProvider_invalid_file())('Case #%# $name', async (data) => {
            const service = new OASJSONDefinitionsRetrieveService();
            const actual = async () => { await service.retrieve(data.filename); };

            await expect(() => actual()).rejects.toThrowError(data.errorContains);
        });

        function dataProvider_invalid_file() {
            return [
                { name: 'No ".json" extension', filename: 'some/no-extension', errorContains: 'must have a \'.json\' extension' },
                { name: 'Not an existing file', filename: 'some/nonexistent.json', errorContains: 'does not exist' },
            ];
        }
    });

    describe('+retrieve() #2: Should fail for local file content', () => {

        it.each(dataProvider_invalid_content())('Case #%# $name', async (data) => {
            const service = new OASJSONDefinitionsRetrieveService();
            (service as any).retrieveFile = vi.fn().mockResolvedValue(data.content);
            const actual = async () => { await service.retrieve(filename); };

            await expect(() => actual()).rejects.toThrowError(data.errorContains);
        });

        function dataProvider_invalid_content() {
            return [
                { name: 'Not a potential JSON string (1)', content: '{', errorContains: 'neither string nor object' },
                { name: 'Not a potential JSON string (2)', content: 123, errorContains: 'neither string nor object' },
                { name: 'Not a potential JSON object', content: '{123}', errorContains: 'Could not parse the given content as JSON' },
                { name: 'JSON is not a valid OAS', content: { dummy: 123 }, errorContains: 'is not a valid OpenAPI v3.1.0 document' },
            ];
        }

    });

});


