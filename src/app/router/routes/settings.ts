import type { RouteRecordRaw } from 'vue-router';

import { KEY_ROUTE } from '../constants/route.const';

const ViewSettings = () => import('@/app/view/settings/ViewSettings.vue');

export const routeSettings: RouteRecordRaw = {
  path: 'settings',
  children: [
    {
      path: '',
      name: KEY_ROUTE.settings.index,
      component: ViewSettings,
    },
  ],
};