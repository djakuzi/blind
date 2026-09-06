import {
  APP_SCALE_CSS_VARIABLE_NAME,
  APP_SCALE_MODE,
  type tAppScalePresetMode,
} from '@/app/styles/contracts/appScale.contract';

import { DomProperty } from '@/core/dom/property';

export function applyAppScaleMode(
  appScaleMode: tAppScalePresetMode,
) {
  DomProperty.setProperty(
    APP_SCALE_CSS_VARIABLE_NAME,
    String(APP_SCALE_MODE[appScaleMode]),
  );
}