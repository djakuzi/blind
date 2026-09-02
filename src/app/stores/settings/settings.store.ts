import { defineStore } from 'pinia';

import {
  APP_ROOT_FONT_SIZE_BASE_VALUE,
  APP_SCALE_SYSTEM_MODE,
} from '@/app/styles/contracts/appScale.contract';
import { APP_THEME_SYSTEM_MODE } from '@/app/styles/contracts/appTheme.contract';
import { createLoadAppRootFontSize } from './actions/createLoadAppRootFontSize';
import { createLoadAppScaleMode } from './actions/createLoadAppScaleMode';
import { createLoadAppThemeMode } from './actions/createLoadAppThemeMode';
import { createSetAppRootFontSize } from './actions/createSetAppRootFontSize';
import { createSetAppScaleMode } from './actions/createSetAppScaleMode';
import { createSetAppThemeMode } from './actions/createSetAppThemeMode';
import type { iSettingsState } from './settings.type';

export const useSettingsStore = defineStore('settings', {
  state: (): iSettingsState => ({
    appRootFontSize: APP_ROOT_FONT_SIZE_BASE_VALUE,
    appScaleMode: APP_SCALE_SYSTEM_MODE,
    appThemeMode: APP_THEME_SYSTEM_MODE,
  }),
  actions: {
    loadAppRootFontSize: createLoadAppRootFontSize(),
    loadAppScaleMode: createLoadAppScaleMode(),
    loadAppThemeMode: createLoadAppThemeMode(),
    setAppRootFontSize: createSetAppRootFontSize(),
    setAppScaleMode: createSetAppScaleMode(),
    setAppThemeMode: createSetAppThemeMode(),
  },
});
