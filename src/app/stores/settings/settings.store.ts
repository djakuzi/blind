import { defineStore } from 'pinia';

import {
  APP_SCALE_SYSTEM_MODE,
} from '@/app/styles/contracts/appScale.contract';
import { APP_THEME_SYSTEM_MODE } from '@/app/styles/contracts/appTheme.contract';
import { createLoadAppScaleMode } from './actions/createLoadAppScaleMode';
import { createLoadAppThemeMode } from './actions/createLoadAppThemeMode';
import { createSetAppScaleMode } from './actions/createSetAppScaleMode';
import { createSetAppThemeMode } from './actions/createSetAppThemeMode';
import type { iSettingsState } from './settings.type';

export const useSettingsStore = defineStore('settings', {
  state: (): iSettingsState => ({
    appScaleMode: APP_SCALE_SYSTEM_MODE,
    appThemeMode: APP_THEME_SYSTEM_MODE,
  }),
  actions: {
    loadAppScaleMode: createLoadAppScaleMode(),
    loadAppThemeMode: createLoadAppThemeMode(),
    setAppScaleMode: createSetAppScaleMode(),
    setAppThemeMode: createSetAppThemeMode(),
  },
});
