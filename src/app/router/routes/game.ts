import type { RouteRecordRaw } from 'vue-router';
import { createLazyRoute } from '@/core/app/route/lazy/routeLazy';
import { KEY_ROUTE } from '../constants/route.const';

const ViewGame = createLazyRoute(KEY_ROUTE.game.index, () => import('@/app/view/game/ViewGame.vue'));

export const routeGame: RouteRecordRaw = {
  path: 'game',
  children: [
    {
      path: '',
      name: KEY_ROUTE.game.index,
      component: ViewGame,
      meta: {
        layout: {
          header: false,
        },
      },
    },
  ],
};
