import type { iLoaderState, tLoaderScopeKey } from '../loader.type';

export function createClearScope() {
  return function clearScope(this: iLoaderState, scopeKey: tLoaderScopeKey) {
    delete this.scopes[scopeKey];
    this.errors = this.errors.filter((error) => error.scopeKey !== scopeKey);
  };
}
