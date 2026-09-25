import { computed } from 'vue';
import { setupState } from './setup.state';

export function useSetup() {
  const isReady = computed(() => setupState.isReady);
  const isRunning = computed(() => setupState.isRunning);

  return {
    isReady,
    isRunning,
  };
}
