import type { tAppScaleMode } from '@/app/shared/styles/contracts/appScale.contract';
import { ToolStorage } from '@/core/platform';
import { APP_SCALE_MODE_STORAGE_KEY } from '../settings.const';
import type { iSettingsState } from '../settings.type';

export function createSetAppScaleMode() {
  return async function setAppScaleMode(this: iSettingsState, appScaleMode: tAppScaleMode) {
    this.appScaleMode = appScaleMode;
    await ToolStorage.setItem(APP_SCALE_MODE_STORAGE_KEY, appScaleMode);
  };
}
