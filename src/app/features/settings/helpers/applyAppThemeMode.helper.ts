import { type tAppThemeMode, APP_THEME_SYSTEM_MODE, APP_THEME_ATTRIBUTE_NAME } from "@/app/styles/contracts/appTheme.contract";
import { DomAttribute } from "@/core/dom/attribute";

export function applyAppThemeMode(
  appThemeMode: tAppThemeMode,
) {
  if (appThemeMode === APP_THEME_SYSTEM_MODE) {
    DomAttribute.removeAttribute(
      APP_THEME_ATTRIBUTE_NAME,
    );

    return;
  }

  DomAttribute.setAttribute(
    APP_THEME_ATTRIBUTE_NAME,
    appThemeMode,
  );
}