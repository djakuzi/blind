import {
  APP_ROOT_FONT_SIZE_BASE_VALUE,
  isAppRootFontSize,
} from '@/app/styles/contracts/appScale.contract';
import { ToolStorage } from '@/core/tool/storage';

import { APP_ROOT_FONT_SIZE_STORAGE_KEY } from '../settings.const';
import type { iSettingsState } from '../settings.type';

export function createLoadAppRootFontSize() {
  return async function loadAppRootFontSize(this: iSettingsState) {
    const savedAppRootFontSize = Number(
      await ToolStorage.getItem(APP_ROOT_FONT_SIZE_STORAGE_KEY),
    );

    if (!isAppRootFontSize(savedAppRootFontSize)) {
      this.appRootFontSize = APP_ROOT_FONT_SIZE_BASE_VALUE;
      await ToolStorage.setItem(
        APP_ROOT_FONT_SIZE_STORAGE_KEY,
        String(APP_ROOT_FONT_SIZE_BASE_VALUE),
      );

      return this.appRootFontSize;
    }

    this.appRootFontSize = savedAppRootFontSize;

    return this.appRootFontSize;
  };
}
