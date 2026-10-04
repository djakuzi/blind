import { HelperMediaQuery } from '../../../runtime/shared/helpers/media-query.helper';
import { DARK_THEME_MEDIA_QUERY } from '../const';

function getLanguage() {
  if (typeof navigator === 'undefined' || !navigator.language) {
    throw new Error('System language is not available');
  }

  return navigator.language;
}

function prefersDarkTheme() {
  return HelperMediaQuery.matches(DARK_THEME_MEDIA_QUERY);
}

export const HelperBrowserSystem = {
  getLanguage,
  prefersDarkTheme,
};
