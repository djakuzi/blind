import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { routeSettings } from './sections/settings';
import { routeMenu } from './sections/menu';
import { routeGame } from './sections/game';
import { KEY_ROUTE } from './constants/route.const';

const LayotRoot = () => import('@/app/layouts/LayoutRoot.vue');

export const rootRoute: RouteRecordRaw = {
  path: '/',
  component: LayotRoot,
  redirect: KEY_ROUTE.menu.index,
  children: [
    routeMenu,
    routeGame,
    routeSettings,
  ],
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [rootRoute],
});

export default router;
