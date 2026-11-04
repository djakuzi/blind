export type tLayoutSafeArea = boolean | 'none' | 'horizontal' | 'vertical';

export interface iLayoutRouteMeta {
  header?: boolean;
  safeArea?: tLayoutSafeArea;
  version?: boolean;
}
