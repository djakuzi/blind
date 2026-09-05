import type { RouteRecordRaw } from 'vue-router';

import { KEY_ROUTE } from '../constants/route.const';

const ViewMenu = () => import('@/app/view/menu/ViewMenu.vue');

export const routeMenu: RouteRecordRaw = {
  path: 'menu',
  children: [
    {
      path: '',
      name: KEY_ROUTE.menu.index,
      component: ViewMenu,
      meta: {
        layout: {
          header: false,
        },
      },
    },
  ],
};