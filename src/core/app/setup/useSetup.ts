import { computed } from 'vue';
import { getSetupReadyState, getSetupRunningState } from './setup.state';

export function useSetup() {
  const isReady = computed(() => getSetupReadyState());
  const isRunning = computed(() => getSetupRunningState());

  return {
    isReady,
    isRunning,
  };
}
