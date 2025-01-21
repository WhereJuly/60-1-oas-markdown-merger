'use strict';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import fs from 'fs';
import { execSync } from 'child_process';

const tempFolder = '../tests/foundation/.ancillary/fixtures/.temp';

describe('CLI Application Usage Test', () => {

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

    it('merge: Should successfully merge markdown files from custom merges base directory', () => {
        const expectedMarkdown = '../tests/foundation/.ancillary/fixtures/markdown/simple.md';

        const destinationFile = `${tempFolder}/output.json`;
        const output = execSync(`npx oas-markdown-merger --source ../tests/foundation/.ancillary/fixtures/definitions/petstore.oas.json --destination ${destinationFile} --merges-base ../`).toString();

        expect(output).toEqual(expect.stringContaining('Successfully merged to'));

        const expected = fs.readFileSync(expectedMarkdown).toString('utf-8');
        const merged = fs.readFileSync(destinationFile).toString('utf-8');

        const actual = merged.split(`<p>${expected}</p>`).length - 1;

        expect(actual).toEqual(3);
    });

});
