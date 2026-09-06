import type { Pinia } from 'pinia';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { applyAppScaleMode } from '../helpers/applyAppScaleMode.helper';

export function useAppScaleSetup(pinia: Pinia) {
  const settingsStore = useSettingsStore(pinia);

  async function setupAppScale() {
    const savedAppScaleMode =
      await settingsStore.loadAppScaleMode();

    await applyAppScaleMode(savedAppScaleMode);
  }

  return {
    setupAppScale,
  };
}