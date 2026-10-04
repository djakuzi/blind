import 'vue-router';
import type { iLayoutRouteMeta } from '@/app/layouts/types/layout.type';
import type { iRouteLazyMeta } from '@/core/app/route/lazy/routeLazy.type';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: iLayoutRouteMeta;
    lazy?: iRouteLazyMeta;
  }
}
