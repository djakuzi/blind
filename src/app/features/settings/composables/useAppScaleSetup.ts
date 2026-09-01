import type { Pinia } from 'pinia';

import {
  APP_SCALE_CSS_VARIABLE_NAME,
  APP_SCALE_MODE,
  APP_SCALE_SYSTEM_MODE,
  type tAppScaleMode,
  type tAppScalePresetMode,
} from '@/app/styles/contracts/appScale.contract';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { DomProperty } from '@/core/dom/property';
import { ToolSystem } from '@/core/tool/system';

function resolveAppScale(appScaleMode: tAppScaleMode, systemScaleValue: number) {
  if (appScaleMode === APP_SCALE_SYSTEM_MODE) {
    return systemScaleValue;
  }

  return APP_SCALE_MODE[appScaleMode as tAppScalePresetMode];
}

export function useAppScaleSetup(pinia: Pinia) {
  const settingsStore = useSettingsStore(pinia);

  async function setupAppScale() {
    const savedAppScaleMode = await settingsStore.loadAppScaleMode();
    const { value } = await ToolSystem.getSystemScale();
    const appScaleValue = resolveAppScale(savedAppScaleMode, value);

    DomProperty.setProperty(APP_SCALE_CSS_VARIABLE_NAME, String(appScaleValue));
  }

  return {
    setupAppScale,
  };
}
