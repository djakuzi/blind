import { KEY_ROUTE } from '../constants/route.const'

const LayotRoot = () => import('@/app/layouts/LayoutRoot.vue')
const ViewGame = () => import('@/app/view/game/ViewGame.vue')

export const routeGame: RouteRecordRaw = {
  path: 'menu',
  component: LayotRoot,
  children: [
    {
      path: '',
      name: KEY_ROUTE.menu.index,
      component: ViewGame,
    },
  ],
}
