import { useLoaderStore } from '@/app/stores/loader/loader.store';
import type {
  iRegisterLoaderScopePayload,
  iSetLoaderResourceStatePayload,
  tAddLoaderResourceErrorPayload,
  tLoaderScopeKey,
} from '@/app/stores/loader/loader.type';

export function useLoaderRegistry() {
  const loaderStore = useLoaderStore();

  function registerScope(payload: iRegisterLoaderScopePayload) {
    loaderStore.registerScope(payload);
  }

  function setResourceState(payload: iSetLoaderResourceStatePayload) {
    loaderStore.setResourceState(payload);
  }

  function addResourceError(payload: tAddLoaderResourceErrorPayload) {
    loaderStore.addResourceError(payload);
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
    addResourceError,
    clearScope,
    completeScope,
    registerScope,
    reset,
    setResourceState,
  };
}
