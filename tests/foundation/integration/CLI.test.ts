'use strict';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import fs from 'fs';
import { exec, execSync } from 'child_process';

const tempFolder = './tests/foundation/.ancillary/fixtures/.temp';

describe('CLI Application', () => {

    // Ensure a clean state for written files before each test.
    beforeEach(() => {
        fs.existsSync(tempFolder) && fs.rmSync(tempFolder, { recursive: true, force: true });
        fs.mkdirSync(tempFolder);
    });

    // Clean up after tests
    afterEach(() => {
        fs.existsSync(tempFolder) && fs.rmSync(tempFolder, { recursive: true, force: true });
    });

    it('Should successfully merge OAS file', () => {
        const expectedMarkdown = './tests/foundation/.ancillary/fixtures/markdown/simple.md';

        const outputFile = `${tempFolder}/output.json`;
        const output = execSync(`tsx src/cli/cli.ts --input ./tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json --output ${outputFile}`).toString();

        expect(output).toEqual(expect.stringContaining('Successfully merged to'));

        const expected = fs.readFileSync(expectedMarkdown).toString('utf-8');
        const merged = fs.readFileSync(outputFile).toString('utf-8');

        const actual = merged.split(`<p>${expected}</p>`).length - 1;

        expect(actual).toEqual(3);
    });

    it('Should handle errors gracefully', async () => {
        try {
            const output = exec('tsx src/cli/cli.ts --input input.json --output output.json').toString();

        } catch (_error) {
            const error = _error as Error;

            expect(error.message).toEqual(expect.stringContaining('ERROR'));
            expect(error.message).toEqual(expect.stringContaining('input.json" does not exist'));
        }
    });

});
