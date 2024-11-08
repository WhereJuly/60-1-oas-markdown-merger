'use strict';

import { describe, expect, it, Mock, vi } from 'vitest';
import { valid_oas } from '@fixtures/definitions/index.js';

import { readFile } from 'fs/promises';

import OASJSONDefinitionsRetrieveService from '@src/OASJSONDefinitionsRetrieve.service.js';

vi.mock('fs/promises', () => ({
    readFile: vi.fn(),
}));

const filename = './tests/foundation/.ancillary/fixtures/definitions/valid.json';

// 'packages/adapters/generic/tests/foundation/.ancillary/fixtures/definitions/valid.json'

describe('[Unit] OASJSONDefinitionsRetrieveServiceTest', () => {

    console.warn('TBW: There should be also an integration test for local and remote loading');

    it('+constructor(): Should create OASJSONDefinitionsRetrieveService expected object', () => {
        const actual = new OASJSONDefinitionsRetrieveService();

        expect(actual).toBeInstanceOf(OASJSONDefinitionsRetrieveService);
        expect(actual.retrieve).toBeInstanceOf(Function);
    });

    describe('+retrieve(): Should retrieve definitions from local file or remote url', () => {

        it('+retrieve(): local file successfully', async () => {
            const fixture = valid_oas;
            (readFile as Mock).mockResolvedValue(fixture);
            const service = new OASJSONDefinitionsRetrieveService();

            const actual = await service.retrieve(filename);

            expect(actual).toEqual(fixture);

            console.dir(actual);
        });

        // Assert retrieve throws for see {@link https://lean-web-enterprise.atlassian.net/browse/DCPLDOAS-9/}

    });

});


