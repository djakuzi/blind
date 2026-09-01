import type { iLoaderState, tLoaderScopeKey } from '../loader.type';

export function createCompleteScope() {
  return function completeScope(this: iLoaderState, scopeKey: tLoaderScopeKey) {
    const currentScope = this.scopes[scopeKey];

    if (!currentScope) {
      return;
    }

    Object.keys(currentScope.resources).forEach((resourceKey) => {
      currentScope.resources[resourceKey] = true;
    });
    currentScope.isLoaded = true;
  };
}
