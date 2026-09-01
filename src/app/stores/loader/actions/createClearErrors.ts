import type { iLoaderState, tLoaderScopeKey } from '../loader.type';

export function createClearErrors() {
  return function clearErrors(this: iLoaderState, scopeKey?: tLoaderScopeKey) {
    if (!scopeKey) {
      this.errors = [];

      return;
    }

    this.errors = this.errors.filter((error) => error.scopeKey !== scopeKey);
  };
}
