import { HelperMediaQuery } from '../../../runtime/shared/helpers/media-query.helper';
import {
  FINE_HOVER_POINTER_MEDIA_QUERY,
  FINE_POINTER_MEDIA_QUERY,
  HOVER_MEDIA_QUERY,
  PRIMARY_FINE_POINTER_MEDIA_QUERY,
} from '../const';
import { HelperBrowserInput } from '../helpers/browser.helper';
import type { iInputAdapter } from '../type';

export const DesktopInputAdapter: iInputAdapter = {
  supportsPointerEvents: HelperBrowserInput.supportsPointerEvents,

  canHover() {
    return {
      value: HelperMediaQuery.matches(HOVER_MEDIA_QUERY),
    };
  },

  hasFinePointer() {
    return {
      value: HelperMediaQuery.matches(FINE_POINTER_MEDIA_QUERY),
    };
  },

  hasFineHoverPointer() {
    return {
      value: HelperMediaQuery.matches(FINE_HOVER_POINTER_MEDIA_QUERY),
    };
  },

  isPrimaryPointerFine() {
    return {
      value: HelperMediaQuery.matches(PRIMARY_FINE_POINTER_MEDIA_QUERY),
    };
  },

  onFineHoverPointerChange(callback) {
    return HelperMediaQuery.subscribe(FINE_HOVER_POINTER_MEDIA_QUERY, callback);
  },
};
