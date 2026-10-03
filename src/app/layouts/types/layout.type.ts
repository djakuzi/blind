import type { Locale } from '@/app/shared/types/locale';

export type tLayoutSafeArea = boolean | 'none' | 'horizontal' | 'vertical';

export type tLayoutHeaderTitle = (locale: Locale) => string;

export interface iLayoutHeaderRouteMeta {
  logo?: boolean;
  title?: tLayoutHeaderTitle;
}

export type tLayoutHeader = boolean | iLayoutHeaderRouteMeta;

export interface iLayoutRouteMeta {
  header?: tLayoutHeader;
  safeArea?: tLayoutSafeArea;
  version?: boolean;
}
