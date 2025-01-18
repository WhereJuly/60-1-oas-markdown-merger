'use strict';

import { fileURLToPath, pathToFileURL } from 'node:url';
import { cwd } from 'node:process';
import { configDefaults, defineConfig } from 'vitest/config';

import _excluded from './excluded.js';

const root = pathToFileURL(cwd()).toString();
const excluded = _excluded(configDefaults.exclude);

// console.log(fileURLToPath(new URL('../../../', import.meta.url)));
// console.log(fileURLToPath(new URL('../../../../', import.meta.url)) + 'src/**/*.{ts,tsx}');

export default defineConfig({
    plugins: [],
    resolve: {
        alias: {
            '@src': fileURLToPath(new URL(`${root}/src`, import.meta.url)),
            '@tests': fileURLToPath(new URL(`${root}/tests`, import.meta.url)),
            '@fixtures': fileURLToPath(new URL(`${root}/tests/foundation/.ancillary/fixtures`, import.meta.url)),
        }
    },
    test: {
        /**
         * WARNING: To prevent errors from multiple disk Postgres DB initializations in parallel test
         * set `fileParallelism` to `false`. SQLite in-memory tests do not cause the error.
         * `NODE_ENV=test` configured to run in-memory tests. Thus the option is set conditionally. 
         * @see config implementation/src/config/database.json#test
         */
        // fileParallelism: false,

        /**
         * WARNING: To prevent tests hanging.
         * @see https://vitest.dev/guide/common-errors.html#failed-to-terminate-worker
         */
        pool: 'forks',

        setupFiles: ['./tests/foundation/.ancillary/bootstrap/setup.ts'],
        cache: false,
        reporters: ['verbose'],
        globals: true,
        // NB: Can be configured via TEST_INCLUDE environment variable
        exclude: excluded,
        root: fileURLToPath(new URL('../../../../', import.meta.url)),
        // NB: Something changed in the configuration API. Would look later.
        chaiConfig: {
            truncateThreshold: 200
        },
        coverage: {
            reporter: ['text', 'json', 'html'],
            clean: true,
            include: ['src/**/*.{ts,tsx}'],
            exclude: ['**/*.d.ts', '**/*.types.ts', '**/types.ts'],
            reportsDirectory: fileURLToPath(new URL(`${root}/tests/foundation/.coverage`)),
            thresholds: {
                lines: 90
            }
        }
    }
});
