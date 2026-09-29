import type { tAppLoadingStatus } from '@/app/shared/types/status';
import { LOADER_PROGRESS_MODE_DEFAULT } from './loader.const';
import type {
  iLoaderResource,
  iLoaderResourceError,
  iLoaderResourcePayload,
  iLoaderScope,
  iLoaderState,
  iRegisterLoaderScopePayload,
} from './loader.type';

export function createLoaderResource(state: tAppLoadingStatus): iLoaderResource {
  return {
    state,
  };
}

export function createLoaderScope(payload: iRegisterLoaderScopePayload): iLoaderScope {
  const resources = Object.fromEntries(
    Object.entries(payload.resources).map(([resourceKey, state]) => [resourceKey, createLoaderResource(state)]),
  );

  return {
    key: payload.scopeKey,
    title: payload.title,
    progressMode: payload.progressMode ?? LOADER_PROGRESS_MODE_DEFAULT,
    resources,
  };
}

export function getScopeLoadedState(resources: iLoaderScope['resources']) {
  const resourceStates = Object.values(resources);

  return resourceStates.length > 0 && resourceStates.every((resource) => resource.state === 'loaded');
}

export function getResourcesCount(scopes: iLoaderState['scopes']) {
  return Object.values(scopes).reduce((count, scope) => {
    return count + Object.keys(scope.resources).length;
  }, 0);
}

export function getResourcesCountByStatus(scopes: iLoaderState['scopes'], status: tAppLoadingStatus) {
  return Object.values(scopes).reduce((count, scope) => {
    return count + Object.values(scope.resources).filter((resource) => resource.state === status).length;
  }, 0);
}

export function setLoaderResourceStatus(
  loaderState: iLoaderState,
  payload: iLoaderResourcePayload,
  status: tAppLoadingStatus,
  error?: iLoaderResourceError,
) {
  const currentScope =
    loaderState.scopes[payload.scopeKey] ??
    (loaderState.scopes[payload.scopeKey] = {
      key: payload.scopeKey,
      progressMode: LOADER_PROGRESS_MODE_DEFAULT,
      resources: {},
    });

  const resource = currentScope.resources[payload.resourceKey] ?? createLoaderResource(status);

  resource.state = status;

  if (error) {
    resource.error = error;
  } else {
    delete resource.error;
  }

  currentScope.resources[payload.resourceKey] = resource;
}
