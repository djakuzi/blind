import {
  FINE_HOVER_POINTER_MEDIA_QUERY,
  FINE_POINTER_MEDIA_QUERY,
  HOVER_MEDIA_QUERY,
  PRIMARY_FINE_POINTER_MEDIA_QUERY,
} from '../const';
import { HelperBrowserInput } from '../helpers/browser.helper';
import type { iInputAdapter } from '../type';

export const WebInputAdapter: iInputAdapter = {
  supportsPointerEvents: HelperBrowserInput.supportsPointerEvents,

  canHover() {
    return HelperBrowserInput.matchesMediaQuery(HOVER_MEDIA_QUERY);
  },

  hasFinePointer() {
    return HelperBrowserInput.matchesMediaQuery(FINE_POINTER_MEDIA_QUERY);
  },

  hasFineHoverPointer() {
    return HelperBrowserInput.matchesMediaQuery(FINE_HOVER_POINTER_MEDIA_QUERY);
  },

  isPrimaryPointerFine() {
    return HelperBrowserInput.matchesMediaQuery(PRIMARY_FINE_POINTER_MEDIA_QUERY);
  },

  onFineHoverPointerChange(callback) {
    return HelperBrowserInput.onMediaQueryChange(FINE_HOVER_POINTER_MEDIA_QUERY, callback);
  },
};
