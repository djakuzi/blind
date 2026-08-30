import type { Pinia } from 'pinia';

import {
  APP_THEME_ATTRIBUTE_NAME,
  APP_THEME_SYSTEM_MODE,
} from '@/app/styles/contracts/appTheme.contract';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { DomAttribute } from '@/core/dom/attribute';

export async function setupTheme(pinia: Pinia) {
  const settingsStore = useSettingsStore(pinia);
  const savedAppThemeMode = await settingsStore.loadAppThemeMode();

  if (savedAppThemeMode === APP_THEME_SYSTEM_MODE) {
    DomAttribute.removeAttribute(APP_THEME_ATTRIBUTE_NAME);

    return;
  }

  DomAttribute.setAttribute(APP_THEME_ATTRIBUTE_NAME, savedAppThemeMode);
}
