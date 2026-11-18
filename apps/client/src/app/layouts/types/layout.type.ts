export type tLayoutSafeArea = boolean | 'none' | 'horizontal' | 'vertical';

export interface iLayoutRouteMeta {
  header?: boolean;
  back?: boolean;
  safeArea?: tLayoutSafeArea;
  version?: boolean;
}
