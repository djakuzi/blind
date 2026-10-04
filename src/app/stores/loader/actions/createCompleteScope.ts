import type { iLoaderState, tLoaderScopeKey } from '../loader.type';

export function createCompleteScope() {
  return function completeScope(this: iLoaderState, scopeKey: tLoaderScopeKey) {
    const currentScope = this.scopes[scopeKey];

    if (!currentScope) {
      return;
    }

    Object.values(currentScope.resources).forEach((resource) => {
      resource.state = 'loaded';
      delete resource.error;
    });
  };
}
