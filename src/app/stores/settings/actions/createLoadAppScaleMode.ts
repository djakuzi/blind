import {
  APP_SCALE_SYSTEM_MODE,
  isAppScaleMode,
  resolveNearestAppScalePresetMode,
} from '@/app/styles/contracts/appScale.contract';

import { ToolStorage } from '@/core/tool/storage';
import { ToolSystem } from '@/core/tool/system';

import {
  APP_SCALE_MODE_STORAGE_KEY,
} from '../settings.const';

import type {
  iSettingsState,
} from '../settings.type';

export function createLoadAppScaleMode() {
  return async function loadAppScaleMode(
    this: iSettingsState,
  ) {
    const savedAppScaleMode =
      await ToolStorage.getItem(
        APP_SCALE_MODE_STORAGE_KEY,
      );

    if (
      savedAppScaleMode
      && isAppScaleMode(savedAppScaleMode)
      && savedAppScaleMode !== APP_SCALE_SYSTEM_MODE
    ) {
      this.appScaleMode = savedAppScaleMode;

      return this.appScaleMode;
    }

    const { value: systemScaleValue } =
      await ToolSystem.getSystemScale();

    const appScaleMode =
      resolveNearestAppScalePresetMode(
        systemScaleValue,
      );

    this.appScaleMode = appScaleMode;

    await ToolStorage.setItem(
      APP_SCALE_MODE_STORAGE_KEY,
      appScaleMode,
    );

    return this.appScaleMode;
  };
}