import { KEY_ROUTE } from '../constants/route.const'

const LayotRoot = () => import('@/app/layouts/LayoutRoot.vue')
const ViewMenu = () => import('@/app/view/menu/ViewMenu.vue')

export const routeMenu: RouteRecordRaw = {
  path: 'menu',
  component: LayotRoot,
  children: [
    {
      path: '',
      name: KEY_ROUTE.menu.index,
      component: ViewMenu,
    },
  ],
}
