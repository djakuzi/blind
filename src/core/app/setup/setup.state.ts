import { reactive } from 'vue';

export const setupState = reactive({
  isReady: false,
  isRunning: false,
});

export function resetSetupState() {
  setupState.isReady = false;
  setupState.isRunning = false;
}
