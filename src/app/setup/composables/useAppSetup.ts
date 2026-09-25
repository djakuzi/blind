import { computed } from 'vue';
import { appSetupState } from '../core/setup.state';

export function useAppSetup() {
  const isReady = computed(() => appSetupState.isReady);

  const isRunning = computed(() => appSetupState.isRunning);

  return {
    isReady,
    isRunning,
  };
}
