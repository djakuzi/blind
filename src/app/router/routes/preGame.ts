import type { RouteRecordRaw } from 'vue-router';

import { KEY_ROUTE } from '../constants/route.const';

const ViewGameMode = () => import('@/app/view/preGame/ViewGameMode.vue');

export const routeGame: RouteRecordRaw = {
  path: 'game',
  children: [
    {
      path: '',
      name: KEY_ROUTE.preGame.index,
      component: ViewGameMode,
    },
  ],
};
