import { createLoaderResource, createLoaderScope } from '../loader.helper';
import type { iLoaderState, iRegisterLoaderScopePayload } from '../loader.type';

export function createRegisterScope() {
  return function registerScope(this: iLoaderState, payload: iRegisterLoaderScopePayload) {
    const currentScope = this.scopes[payload.scopeKey];

    if (!currentScope) {
      this.scopes[payload.scopeKey] = createLoaderScope(payload);

      return;
    }

    currentScope.title = payload.title ?? currentScope.title;

    Object.entries(payload.resources).forEach(([resourceKey, state]) => {
      currentScope.resources[resourceKey] = createLoaderResource(state);
    });
  };
}
