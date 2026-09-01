import type { iLoaderState, tAddLoaderResourceErrorPayload } from '../loader.type';

export function createAddResourceError() {
  return function addResourceError(this: iLoaderState, payload: tAddLoaderResourceErrorPayload) {
    const currentScope = this.scopes[payload.scopeKey];

    if (!currentScope) {
      this.scopes[payload.scopeKey] = {
        key: payload.scopeKey,
        resources: {
          [payload.resourceKey]: false,
        },
        isLoaded: false,
      };
    } else {
      currentScope.resources[payload.resourceKey] = false;
      currentScope.isLoaded = false;
    }

    this.errors.push(payload);
  };
}
