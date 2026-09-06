import {
  APP_SCALE_CSS_VARIABLE_NAME,
  APP_SCALE_MODE,
  APP_SCALE_SYSTEM_MODE,
  resolveNearestAppScalePresetMode,
  type tAppScaleMode,
  type tAppScalePresetMode,
} from '@/app/styles/contracts/appScale.contract';

import { DomProperty } from '@/core/dom/property';
import { ToolSystem } from '@/core/tool/system';

async function resolveAppScalePresetMode(
  appScaleMode: tAppScaleMode,
): Promise<tAppScalePresetMode> {
  if (appScaleMode !== APP_SCALE_SYSTEM_MODE) {
    return appScaleMode;
  }

  const { value } =
    await ToolSystem.getSystemScale();

  return resolveNearestAppScalePresetMode(
    value,
  );
}

export async function applyAppScaleMode(
  appScaleMode: tAppScaleMode,
) {
  const resolvedAppScaleMode =
    await resolveAppScalePresetMode(
      appScaleMode,
    );

  const appScaleValue =
    APP_SCALE_MODE[resolvedAppScaleMode];

  DomProperty.setProperty(
    APP_SCALE_CSS_VARIABLE_NAME,
    String(appScaleValue),
  );
}