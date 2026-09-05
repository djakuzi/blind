import type { RouteRecordRaw } from 'vue-router';

import { KEY_ROUTE } from '../constants/route.const';

const ViewGame = () => import('@/app/view/game/ViewGame.vue');

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