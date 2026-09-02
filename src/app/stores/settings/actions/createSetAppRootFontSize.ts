import type { tAppRootFontSize } from '@/app/styles/contracts/appScale.contract';
import { ToolStorage } from '@/core/tool/storage';

import { APP_ROOT_FONT_SIZE_STORAGE_KEY } from '../settings.const';
import type { iSettingsState } from '../settings.type';

export function createSetAppRootFontSize() {
  return async function setAppRootFontSize(
    this: iSettingsState,
    appRootFontSize: tAppRootFontSize,
  ) {
    this.appRootFontSize = appRootFontSize;
    await ToolStorage.setItem(APP_ROOT_FONT_SIZE_STORAGE_KEY, String(appRootFontSize));
  };
}
