import 'vue-router';

import type { iLayoutRouteMeta } from '@/app/layouts/types/layout.type';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: iLayoutRouteMeta;
  }
}
