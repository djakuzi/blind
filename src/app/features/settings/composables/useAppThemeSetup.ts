import type { Pinia } from 'pinia';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { applyAppThemeMode } from '../helpers/applyAppThemeMode.helper';

export function useAppThemeSetup(pinia: Pinia) {
  const settingsStore = useSettingsStore(pinia);

  async function setupAppTheme() {
    const savedAppThemeMode = await settingsStore.loadAppThemeMode();

    await applyAppThemeMode(savedAppThemeMode);
  }

  return {
    setupAppTheme,
  };
}
