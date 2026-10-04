import type { RouteRecordRaw } from 'vue-router';
import { createLazyRoute } from '@/core/app/route/lazy/routeLazy';
import { KEY_ROUTE } from '../constants/route.const';

const ViewMenu = createLazyRoute(KEY_ROUTE.menu.index, () => import('@/app/view/menu/ViewMenu.vue'));

export const routeMenu: RouteRecordRaw = {
  path: 'menu',
  children: [
    {
      path: '',
      name: KEY_ROUTE.menu.index,
      component: ViewMenu,
      meta: {
        lazy: {
          preload: [KEY_ROUTE.preGame.index, KEY_ROUTE.settings.index],
        },
        layout: {
          header: false,
        },
      },
    },
  ],
};
