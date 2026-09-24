import { reactive } from 'vue';

export const appSetupState = reactive({
  isReady: false,
  isRunning: false,
});

export function resetAppSetupState() {
  appSetupState.isReady = false;
  appSetupState.isRunning = false;
}
