import {
  APP_SCALE_SYSTEM_MODE,
  isAppScaleMode,
} from '@/app/styles/contracts/appScale.contract';
import { ToolStorage } from '@/core/tool/storage';

import { APP_SCALE_MODE_STORAGE_KEY } from '../settings.const';
import type { iSettingsState } from '../settings.type';

export function createLoadAppScaleMode() {
  return async function loadAppScaleMode(this: iSettingsState) {
    const savedAppScaleMode = await ToolStorage.getItem(APP_SCALE_MODE_STORAGE_KEY);

    if (!savedAppScaleMode || !isAppScaleMode(savedAppScaleMode)) {
      this.appScaleMode = APP_SCALE_SYSTEM_MODE;
      await ToolStorage.setItem(APP_SCALE_MODE_STORAGE_KEY, APP_SCALE_SYSTEM_MODE);

      return this.appScaleMode;
    }

    this.appScaleMode = savedAppScaleMode;

    return this.appScaleMode;
  };
}
