export type tLayoutSafeArea = boolean | 'none' | 'horizontal' | 'vertical';

export type tLayoutHeader = boolean;

export interface iLayoutRouteMeta {
  header?: tLayoutHeader
  safeArea?: tLayoutSafeArea
}
