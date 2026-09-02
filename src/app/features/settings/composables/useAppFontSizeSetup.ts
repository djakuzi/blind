import type { Pinia } from 'pinia';

import {
  APP_ROOT_FONT_SIZE_BASE_VALUE,
  APP_ROOT_FONT_SIZE_CSS_VARIABLE_NAME,
  APP_SCALE_CSS_VARIABLE_NAME,
} from '@/app/styles/contracts/appScale.contract';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { DomProperty } from '@/core/dom/property';
import { ToolSystem } from '@/core/tool/system';

export function useAppFontSizeSetup(pinia: Pinia) {
  const settingsStore = useSettingsStore(pinia);

  async function setupAppFontSize() {
    await settingsStore.loadAppRootFontSize();

    const viewportRatio = ToolSystem.getViewportRatio();
    const appRootFontSize = Math.round(APP_ROOT_FONT_SIZE_BASE_VALUE * viewportRatio);

    await settingsStore.setAppRootFontSize(appRootFontSize);

    DomProperty.setProperty(
      APP_ROOT_FONT_SIZE_CSS_VARIABLE_NAME,
      `calc(${appRootFontSize}px * var(${APP_SCALE_CSS_VARIABLE_NAME}))`,
    );
  }

  return {
    setupAppFontSize,
  };
}
