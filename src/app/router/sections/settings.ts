import { KEY_ROUTE } from '../constants/route.const'

const LayotRoot = () => import('@/app/layouts/LayoutRoot.vue')
const ViewSettins = () => import('@/app/view/settings/ViewSettins.vue')

export const routeGame: RouteRecordRaw = {
  path: 'menu',
  component: LayotRoot,
  children: [
    {
      path: '',
      name: KEY_ROUTE.menu.index,
      component: ViewSettins,
    },
  ],
}
