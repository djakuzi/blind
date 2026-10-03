import { HelperMediaQuery } from '../../../runtime/shared/helpers/media-query.helper';
import type { iInputAdapter } from '../type';

export const BrowserInputAdapter: iInputAdapter = {
  supportsPointerEvents() {
    return {
      value: typeof globalThis.PointerEvent !== 'undefined',
    };
  },

  matchesMediaQuery(query) {
    return {
      value: HelperMediaQuery.matches(query),
    };
  },

  subscribeMediaQuery(query, callback) {
    return HelperMediaQuery.subscribe(query, callback);
  },
};
