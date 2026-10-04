import { reactive } from 'vue';
import type { tAsyncStatus } from '@/core/types/status';

export const setupState = reactive({
  isPostMountStarted: false,
  blocking: {} as Record<string, tAsyncStatus>,
});

export function resetSetupState() {
  setupState.isPostMountStarted = false;
  setupState.blocking = {};
}

export function initializeBlockingSetupState(keys: readonly string[]) {
  setupState.isPostMountStarted = true;
  setupState.blocking = Object.fromEntries(keys.map((key) => [key, 'pending'])) as Record<string, tAsyncStatus>;
}

export function setBlockingSetupStatus(key: string, status: tAsyncStatus) {
  setupState.blocking[key] = status;
}

export function getSetupReadyState() {
  if (!setupState.isPostMountStarted) {
    return false;
  }

  return Object.values(setupState.blocking).every((status) => status === 'loaded');
}

export function getSetupRunningState() {
  return Object.values(setupState.blocking).some((status) => status === 'pending');
}
