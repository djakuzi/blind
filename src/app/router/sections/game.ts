import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, TAB_KEYS } from '@/app/router/constants/navigation'

const RootLayout = () => import('@/app/layouts/RootLayout.vue')
const CatalogView = () => import('@/views/catalog/CatalogView.vue')
const ProductDetailView = () => import('@/views/catalog/ProductDetailView.vue')

export const catalogRoute: RouteRecordRaw = {
  path: 'catalog',
  component: RootLayout,
  meta: {
    tab: TAB_KEYS.catalog,
  },
  children: [
    {
      path: '',
      name: ROUTE_NAMES.catalog.index,
      component: CatalogView,
      meta: {
        tab: TAB_KEYS.catalog,
        preserveSceneOnQueryChange: true,
        header: {
          visible: true,
          showBack: true,
          actions: ['search', 'filter', 'sort'],
        },
      },
    },
    {
      path: 'products/:productId',
      name: ROUTE_NAMES.catalog.productDetail,
      component: ProductDetailView,
      meta: {
        tab: TAB_KEYS.catalog,
        header: {
          visible: true,
          showBack: true,
          actions: ['fitting', 'favorite'],
        },
      },
    },
  ],
}
