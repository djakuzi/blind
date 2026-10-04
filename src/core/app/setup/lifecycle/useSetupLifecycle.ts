import { computed } from 'vue';
import { getSetupReadyState, getSetupRunningState } from './setupLifecycle.state';

export function useSetupLifecycle() {
  const isReady = computed(() => getSetupReadyState());
  const isRunning = computed(() => getSetupRunningState());

  return {
    isReady,
    isRunning,
  };
}
