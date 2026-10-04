import {
  type tAppThemeMode,
  APP_THEME_SYSTEM_MODE,
  APP_THEME_ATTRIBUTE_NAME,
} from '@/app/styles/contracts/appTheme.contract';
import { DomAttribute } from '@/core/dom/attribute';
import { ToolSystem } from '@/core/platform';

export async function applyAppThemeMode(appThemeMode: tAppThemeMode) {
  if (appThemeMode === APP_THEME_SYSTEM_MODE) {
    DomAttribute.removeAttribute(APP_THEME_ATTRIBUTE_NAME);
  } else {
    DomAttribute.setAttribute(APP_THEME_ATTRIBUTE_NAME, appThemeMode);
  }

  await ToolSystem.setThemeSource(appThemeMode);
}
