import type { RouteRecordRaw } from 'vue-router';
import { KEY_ROUTE } from '../constants/route.const';

const LayoutBase = () => import('@/app/layouts/LayoutBase.vue');
const ViewGame = () => import('@/app/view/game/ViewGame.vue');

export const routeGame: RouteRecordRaw = {
  path: 'game',
  component: LayoutBase,
  children: [
    {
      path: '',
      name: KEY_ROUTE.game.index,
      component: ViewGame,
    },
  ],
};
