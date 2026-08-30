import { defineStore } from 'pinia';

import {
  APP_SCALE_SYSTEM_MODE,
} from '@/app/styles/contracts/appScale.contract';
import { createLoadAppScaleMode } from './actions/createLoadAppScaleMode';
import { createSetAppScaleMode } from './actions/createSetAppScaleMode';
import type { iSettingsState } from './settings.type';

export const useSettingsStore = defineStore('settings', {
  state: (): iSettingsState => ({
    appScaleMode: APP_SCALE_SYSTEM_MODE,
  }),
  actions: {
    loadAppScaleMode: createLoadAppScaleMode(),
    setAppScaleMode: createSetAppScaleMode(),
  },
});
