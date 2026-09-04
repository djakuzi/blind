import 'vue-router';

import type { tLayoutHeader, tLayoutSafeArea } from '@/app/layouts/types/layout.type';

declare module 'vue-router' {
  interface RouteMeta {
    header?: tLayoutHeader;
    safeArea?: tLayoutSafeArea;
  }
}
