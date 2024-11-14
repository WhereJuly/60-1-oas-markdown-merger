'use strict';

import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';

import viteConfig from '../../../../vite.config';

import _excluded from './excluded';

const excluded = _excluded(configDefaults.exclude);

export default mergeConfig(
    viteConfig,
    defineConfig({
        resolve: {
            alias: {
                '@tests': fileURLToPath(new URL('../../', import.meta.url)),
                '@fixtures': fileURLToPath(new URL('../fixtures', import.meta.url)),
            }
        },
        test: {
            exclude: excluded,
            reporters: ['verbose'],
            environment: 'jsdom',
            root: fileURLToPath(new URL('../../', import.meta.url)),
            chaiConfig: {
                truncateThreshold: 100
            }
        },
    }),
);
