'use strict';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import fs from 'fs';
import { exec, execSync } from 'child_process';

const tempFolder = './tests/foundation/.ancillary/fixtures/.temp';

describe('CLI Application', () => {

    // Ensure a clean state for written files before each test.
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        fs.existsSync(tempFolder) && fs.rmSync(tempFolder, { recursive: true, force: true });
        fs.mkdirSync(tempFolder);
    });

    // Clean up after tests
    afterEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        fs.existsSync(tempFolder) && fs.rmSync(tempFolder, { recursive: true, force: true });
    });

    it('Should successfully merge OAS file', () => {
        const expectedMarkdown = './tests/foundation/.ancillary/fixtures/markdown/simple.md';

        const destinationFile = `${tempFolder}/output.json`;
        const output = execSync(`tsx src/cli/cli.ts --source ./tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json --destination ${destinationFile}`).toString();

        expect(output).toEqual(expect.stringContaining('Successfully merged to'));

        const expected = fs.readFileSync(expectedMarkdown).toString('utf-8');
        const merged = fs.readFileSync(destinationFile).toString('utf-8');

        const actual = merged.split(`<p>${expected}</p>`).length - 1;

        expect(actual).toEqual(3);
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    it('Should handle errors gracefully', async () => {
        try {
            exec('tsx src/cli/cli.ts --source source.json --destination destination.json');

        } catch (_error) {
            const error = _error as Error;

            expect(error.message).toEqual(expect.stringContaining('ERROR'));
            expect(error.message).toEqual(expect.stringContaining('source.json" does not exist'));
        }
    });

});
