'use strict';

import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@views/HomeView.vue';
import OASOperationSpecificationView from '@src/views/content/operation/OASOperationSpecification.view.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@views/AboutView.vue'),
    },
    {
      path: '/operations/:operationID',
      component: OASOperationSpecificationView,
      props: true
    },
  ],
});

export default router;
