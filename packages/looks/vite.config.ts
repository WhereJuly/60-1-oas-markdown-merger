'use strict';

import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// NB: Redundant. This shows the dev tools buttons on the app page
// import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // vueDevTools(),
    ],
    resolve: {
        alias: {
            '@src': fileURLToPath(new URL('./src', import.meta.url)),
            '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        },
    },
});
