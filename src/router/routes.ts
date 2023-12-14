import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/xchs',
        component: () => import('pages/InscriptionPage.vue'),
      },
      {
        path: '/inscribe',
        component: () => import('pages/InscribePage.vue'),
      },
      {
        path: '/market',
        component: () => import('pages/MarketPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
