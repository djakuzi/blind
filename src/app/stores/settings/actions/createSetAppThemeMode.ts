import type { tAppThemeMode } from '@/app/styles/contracts/appTheme.contract';
import { ToolStorage } from '@/core/tool/storage';

import { APP_THEME_MODE_STORAGE_KEY } from '../settings.const';
import type { iSettingsState } from '../settings.type';

export function createSetAppThemeMode() {
  return async function setAppThemeMode(this: iSettingsState, appThemeMode: tAppThemeMode) {
    this.appThemeMode = appThemeMode;
    await ToolStorage.setItem(APP_THEME_MODE_STORAGE_KEY, appThemeMode);
  };
}
