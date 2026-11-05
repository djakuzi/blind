import type { RouteRecordRaw } from 'vue-router';
import { createLazyRoute } from '@/core/app/route/lazy/routeLazy';
import { KEY_ROUTE } from '../constants/route.const';

const ViewLobby = createLazyRoute(KEY_ROUTE.lobby.index, () => import('@/app/view/lobby/ViewLobby.vue'));

export const routeLobby: RouteRecordRaw = {
  path: 'lobby',
  children: [
    {
      path: '',
      name: KEY_ROUTE.lobby.index,
      component: ViewLobby,
      meta: {
        lazy: {
          preload: [KEY_ROUTE.game.index],
        },
      },
    },
  ],
};
