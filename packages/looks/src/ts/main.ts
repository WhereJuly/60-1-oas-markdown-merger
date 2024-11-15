import '@src/styles/styles.less';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

// import App from '@views/App.vue';
import router from './router/index';
import AppLayoutView from '../views/layouts/AppLayout.view.vue';

const app = createApp(AppLayoutView);

app.use(createPinia());
app.use(router);

app.mount('#app');
