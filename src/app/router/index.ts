import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import { KEY_ROUTE } from './constants/route.const';
import { routeGame } from './routes/game';
import { routeMenu } from './routes/menu';
import { routeSettings } from './routes/settings';

const LayoutRoot = () => import('@/app/layouts/LayoutRoot.vue');
const LayoutBase = () => import('@/app/layouts/LayoutBase.vue');

export const rootRoute: RouteRecordRaw = {
  path: '/',
  component: LayoutRoot,
  redirect: KEY_ROUTE.menu.index,
  children: [
    {
      path: '',
      component: LayoutBase,
      children: [
        routeMenu,
        routeGame,
        routeSettings,
      ],
    },
  ],
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [rootRoute],
});

export default router;