import { useLoaderStore } from '@/app/stores/loader/loader.store';
import type {
  iLoaderResourcePayload,
  iRegisterLoaderScopePayload,
  iSetLoaderResourceErrorPayload,
  tLoaderScopeKey,
} from '@/app/stores/loader/loader.type';

export function useLoaderRegistry() {
  const loaderStore = useLoaderStore();

  function registerScope(payload: iRegisterLoaderScopePayload) {
    loaderStore.registerScope(payload);
  }

  function setResourcePending(payload: iLoaderResourcePayload) {
    loaderStore.setResourcePending(payload);
  }

  function setResourceLoaded(payload: iLoaderResourcePayload) {
    loaderStore.setResourceLoaded(payload);
  }

  function setResourceError(payload: iSetLoaderResourceErrorPayload) {
    loaderStore.setResourceError(payload);
  }

  function completeScope(scopeKey: tLoaderScopeKey) {
    loaderStore.completeScope(scopeKey);
  }

  function clearScope(scopeKey: tLoaderScopeKey) {
    loaderStore.clearScope(scopeKey);
  }

  function reset() {
    loaderStore.reset();
  }

  return {
    clearScope,
    completeScope,
    registerScope,
    reset,
    setResourceError,
    setResourceLoaded,
    setResourcePending,
  };
}
