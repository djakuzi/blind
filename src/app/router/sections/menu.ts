import type { RouteRecordRaw } from 'vue-router'
import { KEY_ROUTE } from '../constants/route.const'

const LayoutBase = () => import('@/app/layouts/LayoutBase.vue')
const ViewMenu = () => import('@/app/view/menu/ViewMenu.vue')

export const routeMenu: RouteRecordRaw = {
  path: 'menu',
  component: LayoutBase,
  children: [
    {
      path: '',
      name: KEY_ROUTE.menu.index,
      component: ViewMenu,
    },
  ],
}
