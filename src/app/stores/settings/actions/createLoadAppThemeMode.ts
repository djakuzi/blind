import {
  APP_THEME_SYSTEM_MODE,
  isAppThemeMode,
} from '@/app/styles/contracts/appTheme.contract';
import { ToolStorage } from '@/core/tool/storage';

import { APP_THEME_MODE_STORAGE_KEY } from '../settings.const';
import type { iSettingsState } from '../settings.type';

export function createLoadAppThemeMode() {
  return async function loadAppThemeMode(this: iSettingsState) {
    const savedAppThemeMode = await ToolStorage.getItem(APP_THEME_MODE_STORAGE_KEY);

    if (!savedAppThemeMode || !isAppThemeMode(savedAppThemeMode)) {
      this.appThemeMode = APP_THEME_SYSTEM_MODE;
      await ToolStorage.setItem(APP_THEME_MODE_STORAGE_KEY, APP_THEME_SYSTEM_MODE);

      return this.appThemeMode;
    }

    this.appThemeMode = savedAppThemeMode;

    return this.appThemeMode;
  };
}
