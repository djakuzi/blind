import { defineStore } from 'pinia';

import { createAddResourceError } from './actions/createAddResourceError';
import { createClearErrors } from './actions/createClearErrors';
import { createClearScope } from './actions/createClearScope';
import { createCompleteScope } from './actions/createCompleteScope';
import { createRegisterScope } from './actions/createRegisterScope';
import { createResetLoader } from './actions/createResetLoader';
import { createSetResourceState } from './actions/createSetResourceState';
import {
  getLoadedResourcesCount,
  getResourcesCount,
} from './loader.helper';
import type {
  iLoaderState,
} from './loader.type';

export const useLoaderStore = defineStore('loader', {
  state: (): iLoaderState => ({
    scopes: {},
    errors: [],
  }),
  getters: {
    scopesList: (state) => Object.values(state.scopes),
    totalResourcesCount: (state) => getResourcesCount(state.scopes),
    loadedResourcesCount: (state) => getLoadedResourcesCount(state.scopes),
    pendingResourcesCount(): number {
      return this.totalResourcesCount - this.loadedResourcesCount;
    },
    progress(): number {
      if (this.totalResourcesCount === 0) {
        return 0;
      }

      return Math.round((this.loadedResourcesCount / this.totalResourcesCount) * 100);
    },
    hasErrors: (state) => state.errors.length > 0,
    isLoaded(): boolean {
      return this.totalResourcesCount > 0 && this.pendingResourcesCount === 0;
    },
  },
  actions: {
    addResourceError: createAddResourceError(),
    clearErrors: createClearErrors(),
    clearScope: createClearScope(),
    completeScope: createCompleteScope(),
    registerScope: createRegisterScope(),
    reset: createResetLoader(),
    setResourceState: createSetResourceState(),
  },
});
