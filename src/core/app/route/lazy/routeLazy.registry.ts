import type { RouteRecordName } from 'vue-router';
import type { iRouteLazyResource } from './routeLazy.type';

const routeLazyRegistry = new Map<RouteRecordName, iRouteLazyResource>();

export function registerRouteLazy(name: RouteRecordName, resource: iRouteLazyResource) {
  routeLazyRegistry.set(name, resource);
}

export function getRouteLazy(name: RouteRecordName) {
  return routeLazyRegistry.get(name);
}
