import type { RouteRecordRaw } from 'vue-router';
import { createLazyRoute } from '@/core/app/route/lazy/routeLazy';
import { KEY_ROUTE } from '../constants/route.const';

const ViewGameMode = createLazyRoute(KEY_ROUTE.preGame.index, () => import('@/app/view/preGame/ViewGameMode.vue'));
const ViewGameTypeConnection = createLazyRoute(
  KEY_ROUTE.preGame.typeConnection,
  () => import('@/app/view/preGame/ViewGameTypeConnection.vue'),
);

export const routePreGame: RouteRecordRaw = {
  path: 'pre-game',
  children: [
    {
      path: '',
      name: KEY_ROUTE.preGame.index,
      component: ViewGameMode,
      meta: {
        lazy: {
          preload: [KEY_ROUTE.preGame.typeConnection],
        },
        layout: {
          header: {
            title: (locale) => locale.views.preGame.index.ui.title,
          },
        },
      },
    },
    {
      path: 'type-connection',
      name: KEY_ROUTE.preGame.typeConnection,
      component: ViewGameTypeConnection,
      meta: {
        lazy: {
          preload: [KEY_ROUTE.game.index],
        },
        layout: {
          header: {
            title: (locale) => locale.views.preGame.typeConnection.ui.title,
          },
        },
      },
    },
  ],
};
