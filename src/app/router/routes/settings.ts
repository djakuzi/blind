import type { RouteRecordRaw } from 'vue-router';
import { createLazyRoute } from '@/core/app/route/lazy/routeLazy';
import { KEY_ROUTE } from '../constants/route.const';

const ViewSettings = createLazyRoute(KEY_ROUTE.settings.index, () => import('@/app/view/settings/ViewSettings.vue'));

export const routeSettings: RouteRecordRaw = {
  path: 'settings',
  children: [
    {
      path: '',
      name: KEY_ROUTE.settings.index,
      component: ViewSettings,
      meta: {
        layout: {
          header: {
            title: (locale) => locale.views.settings.index.ui.title,
          },
        },
      },
    },
  ],
};
