'use strict';

import 'reflect-metadata';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import type { OpenAPIV3_1 } from 'openapi-types';

import '@src/styles/styles.less';

import router from './router/index';
import AppLayoutView from '../views/layouts/AppLayout.view.vue';
import AdapterBootstrapService from './adapter/AdapterBootstrap.service';

import petstore from '@dcoupld/oas-generic-adapter/examples/oas/petstore.oas.json';

new AdapterBootstrapService(petstore as unknown as OpenAPIV3_1.Document);

const app = createApp(AppLayoutView);

app.use(createPinia());
app.use(router);

app.mount('#app');
