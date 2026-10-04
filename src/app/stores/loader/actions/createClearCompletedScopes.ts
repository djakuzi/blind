import { getScopeLoadedState } from '../loader.helper';
import type { iLoaderState } from '../loader.type';

export function createClearCompletedScopes() {
  return function clearCompletedScopes(this: iLoaderState) {
    Object.values(this.scopes)
      .filter((scope) => getScopeLoadedState(scope.resources))
      .forEach((scope) => {
        delete this.scopes[scope.key];
      });
  };
}
