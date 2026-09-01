import type {
  iLoaderScope,
  iLoaderState,
  iRegisterLoaderScopePayload,
} from './loader.type';

export function getScopeLoadedState(resources: iLoaderScope['resources']) {
  const resourceStates = Object.values(resources);

  return resourceStates.length > 0 && resourceStates.every(Boolean);
}

export function createLoaderScope(payload: iRegisterLoaderScopePayload): iLoaderScope {
  return {
    key: payload.scopeKey,
    title: payload.title,
    resources: payload.resources,
    isLoaded: getScopeLoadedState(payload.resources),
  };
}

export function getResourcesCount(scopes: iLoaderState['scopes']) {
  return Object.values(scopes).reduce((count, scope) => {
    return count + Object.keys(scope.resources).length;
  }, 0);
}

export function getLoadedResourcesCount(scopes: iLoaderState['scopes']) {
  return Object.values(scopes).reduce((count, scope) => {
    return count + Object.values(scope.resources).filter(Boolean).length;
  }, 0);
}
