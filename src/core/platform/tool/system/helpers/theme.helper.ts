import { HelperMediaQuery } from '../../../runtime/shared/helpers/media-query.helper';
import type { tSystemThemeMode } from '../type';

function getBrowserPreferredThemeMode(): tSystemThemeMode {
  return HelperMediaQuery.matches('(prefers-color-scheme: dark)') ? 'dark' : 'light';
}

export const HelperTheme = {
  getBrowserPreferredThemeMode,
};
