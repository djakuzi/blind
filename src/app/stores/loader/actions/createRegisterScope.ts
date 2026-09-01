import { createLoaderScope, getScopeLoadedState } from '../loader.helper';
import type { iLoaderState, iRegisterLoaderScopePayload } from '../loader.type';

export function createRegisterScope() {
  return function registerScope(this: iLoaderState, payload: iRegisterLoaderScopePayload) {
    const currentScope = this.scopes[payload.scopeKey];

    if (!currentScope) {
      this.scopes[payload.scopeKey] = createLoaderScope(payload);

      return;
    }

    currentScope.title = payload.title ?? currentScope.title;
    currentScope.resources = {
      ...currentScope.resources,
      ...payload.resources,
    };
    currentScope.isLoaded = getScopeLoadedState(currentScope.resources);
  };
}
