import { defineStore } from 'pinia';
import { createClearCompletedScopes } from './actions/createClearCompletedScopes';
import { createClearScope } from './actions/createClearScope';
import { createCompleteScope } from './actions/createCompleteScope';
import { createRegisterScope } from './actions/createRegisterScope';
import { createResetLoader } from './actions/createResetLoader';
import { createSetResourceError } from './actions/createSetResourceError';
import { createSetResourceLoaded } from './actions/createSetResourceLoaded';
import { createSetResourcePending } from './actions/createSetResourcePending';
import { getResourcesCount, getResourcesCountByStatus } from './loader.helper';
import type { iLoaderState } from './loader.type';

export const useLoaderStore = defineStore('loader', {
  state: (): iLoaderState => ({
    scopes: {},
  }),
  getters: {
    scopesList: (state) => Object.values(state.scopes),
    totalResourcesCount: (state) => getResourcesCount(state.scopes),
    loadedResourcesCount: (state) => getResourcesCountByStatus(state.scopes, 'loaded'),
    pendingResourcesCount: (state) => getResourcesCountByStatus(state.scopes, 'pending'),
    errorResourcesCount: (state) => getResourcesCountByStatus(state.scopes, 'error'),
    progress(): number {
      if (this.totalResourcesCount === 0) {
        return 0;
      }

      return Math.round((this.loadedResourcesCount / this.totalResourcesCount) * 100);
    },
    hasErrors(): boolean {
      return this.errorResourcesCount > 0;
    },
    isLoaded(): boolean {
      return this.totalResourcesCount > 0 && this.loadedResourcesCount === this.totalResourcesCount;
    },
  },
  actions: {
    clearCompletedScopes: createClearCompletedScopes(),
    clearScope: createClearScope(),
    completeScope: createCompleteScope(),
    registerScope: createRegisterScope(),
    reset: createResetLoader(),
    setResourceError: createSetResourceError(),
    setResourceLoaded: createSetResourceLoaded(),
    setResourcePending: createSetResourcePending(),
  },
});
