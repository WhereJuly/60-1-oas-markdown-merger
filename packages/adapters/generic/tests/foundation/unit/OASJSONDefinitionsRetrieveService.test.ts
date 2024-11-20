'use strict';

import { smallest_oas, valid_json } from '@fixtures/definitions/index.js';

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import nock from 'nock';
import OASJSONDefinitionsRetrieveService from '@src/core/OASJSONDefinitionsRetrieve.service.js';

const filename = './tests/foundation/.ancillary/fixtures/definitions/smallest.oas.json';
// const url = 'http://127.0.0.1:5000/json/valid';

const base = 'http://127.0.0.1:5000';
const server = nock(base);

describe('OASJSONDefinitionsRetrieveServiceTest', () => {

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
            const fixture = smallest_oas;
            const service = new OASJSONDefinitionsRetrieveService();

            const actual = await service.retrieve(filename);

            expect(actual).toEqual(fixture);
        });

        it('Should retrieve JSON from remote url successfully', async () => {
            const fixture = smallest_oas;
            const service = new OASJSONDefinitionsRetrieveService();

            const path = '/json/valid';
            server.get(path).reply(200, fixture);

            const actual = await service.retrieve(`${base}${path}`);

            expect(actual).toEqual(fixture);
        });

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

    describe('+retrieve() #3: Should fail for local file content', () => {

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

    describe('+retrieve() #4: Should fail for loading from a URL', () => {

        beforeEach(() => {
            // REFACTOR: Have to re-create all the mocks for each test as `nock` unexpectedly resets those even they are not used.
            // The docs are not clear about this.
            server.get('/errors/network').replyWithError('Network error');  // Simulates network failure
            server.get('/errors/404').reply(404);
            server.get('/errors/invalid-oas').reply(200, valid_json);
        });

        it.each(dataProvider_invalid_loading_from_url())('Case #%# $name', async (data) => {
            const service = new OASJSONDefinitionsRetrieveService();
            const actual = async () => { await service.retrieve(`${base}/errors/${data.url}`); };

            await expect(() => actual()).rejects.toThrowError(data.errorContains);
        });

        function dataProvider_invalid_loading_from_url() {
            return [
                { name: 'Network error', content: null, url: 'network', errorContains: 'Network error' },
                { name: 'Invalid URL (404)', content: null, url: '404', errorContains: 'Not Found' },
                { name: 'JSON is not a valid OAS', content: valid_json, url: 'invalid-oas', errorContains: 'is not a valid OpenAPI v3.1.0 document' },
            ];
        }

        afterAll(() => {
            nock.cleanAll();
        });

    });

});


