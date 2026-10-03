import {
  FINE_HOVER_POINTER_MEDIA_QUERY,
  FINE_POINTER_MEDIA_QUERY,
  HOVER_MEDIA_QUERY,
  PRIMARY_FINE_POINTER_MEDIA_QUERY,
} from './const';
import type { iInputAdapter, tInputMediaQueryChangeCallback } from './type';

export function createInputTool(adapter: iInputAdapter) {
  return {
    supportsPointerEvents: adapter.supportsPointerEvents,

    canHover() {
      return adapter.matchesMediaQuery(HOVER_MEDIA_QUERY);
    },

    hasFinePointer() {
      return adapter.matchesMediaQuery(FINE_POINTER_MEDIA_QUERY);
    },

    hasFineHoverPointer() {
      return adapter.matchesMediaQuery(FINE_HOVER_POINTER_MEDIA_QUERY);
    },

    isPrimaryPointerFine() {
      return adapter.matchesMediaQuery(PRIMARY_FINE_POINTER_MEDIA_QUERY);
    },

    onFineHoverPointerChange(callback: tInputMediaQueryChangeCallback) {
      return adapter.subscribeMediaQuery(
        FINE_HOVER_POINTER_MEDIA_QUERY,
        callback,
      );
    },
  };
}
