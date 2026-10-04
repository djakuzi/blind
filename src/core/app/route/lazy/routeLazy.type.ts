import type { RouteRecordName } from 'vue-router';

export type tRouteLazyLoader<T> = () => Promise<T>;

export interface iRouteLazyResource {
  preload: () => Promise<void>;
}

export interface iRouteLazyMeta {
  preload?: RouteRecordName[];
}
