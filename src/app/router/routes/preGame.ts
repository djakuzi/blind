import type { RouteRecordRaw } from 'vue-router';
import { KEY_ROUTE } from '../constants/route.const';

const ViewGameMode = () => import('@/app/view/preGame/ViewGameMode.vue');
const ViewGameTypeConnection = () => import('@/app/view/preGame/ViewGameTypeConnection.vue');

export const routePreGame: RouteRecordRaw = {
  path: 'pre-game',
  children: [
    {
      path: '',
      name: KEY_ROUTE.preGame.index,
      component: ViewGameMode,
      meta: {
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
        layout: {
          header: {
            title: (locale) => locale.views.preGame.typeConnection.ui.title,
          },
        },
      },
    },
  ],
};
