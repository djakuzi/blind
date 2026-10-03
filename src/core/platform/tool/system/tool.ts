import { HelperScale } from './helpers/scale.helper';
import type { iSystemAdapter, tSystemThemeMode } from './type';

export function createSystemTool(adapter: iSystemAdapter) {
  async function getSystemLanguage() {
    return adapter.getLanguage();
  }

  async function getSystemScale() {
    const value = await adapter.getScale();

    if (value === null) {
      return HelperScale.getDefaultScale();
    }

    return {
      value: HelperScale.normalizeScaleValue(value),
    };
  }

  function getPreferredThemeMode(): tSystemThemeMode {
    return adapter.prefersDarkTheme() ? 'dark' : 'light';
  }

  return {
    getSystemLanguage,
    getSystemScale,
    getPreferredThemeMode,
  };
}
