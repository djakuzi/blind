import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { PlatformRuntime } from '@/core/platform';
import { KEY_ROUTE } from './constants/route.const';
import { routeGame } from './routes/game';
import { routeMenu } from './routes/menu';
import { routeSettings } from './routes/settings';
import { routePreGame } from './routes/preGame';
import LayoutRoot from '@/app/layouts/LayoutRoot.vue';
import LayoutBase from '@/app/layouts/LayoutBase.vue';

export const rootRoute: RouteRecordRaw = {
  path: '/',
  component: LayoutRoot,
  children: [
    {
      path: '',
      redirect: {
        name: KEY_ROUTE.menu.index,
      },
      component: LayoutBase,
      children: [routeMenu, routePreGame, routeGame, routeSettings],
    },
  ],
};

const router = createRouter({
  history: PlatformRuntime.isDesktop()
    ? createWebHashHistory()
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [rootRoute],
});

export default router;
