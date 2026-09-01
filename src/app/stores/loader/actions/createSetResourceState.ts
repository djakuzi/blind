import { getScopeLoadedState } from '../loader.helper';
import type { iLoaderState, iSetLoaderResourceStatePayload } from '../loader.type';

export function createSetResourceState() {
  return function setResourceState(this: iLoaderState, payload: iSetLoaderResourceStatePayload) {
    const currentScope = this.scopes[payload.scopeKey];

    if (!currentScope) {
      this.scopes[payload.scopeKey] = {
        key: payload.scopeKey,
        resources: {
          [payload.resourceKey]: payload.isLoaded,
        },
        isLoaded: payload.isLoaded,
      };

      return;
    }

    currentScope.resources[payload.resourceKey] = payload.isLoaded;
    currentScope.isLoaded = getScopeLoadedState(currentScope.resources);
  };
}
