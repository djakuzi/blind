import type { iLoaderState } from '../loader.type';

export function createClearCompletedScopes() {
  return function clearCompletedScopes(this: iLoaderState) {
    const completedScopeKeys = Object.values(this.scopes)
      .filter((scope) => scope.isLoaded)
      .map((scope) => scope.key);

    completedScopeKeys.forEach((scopeKey) => {
      delete this.scopes[scopeKey];
    });

    this.errors = this.errors.filter((error) => !completedScopeKeys.includes(error.scopeKey));
  };
}
