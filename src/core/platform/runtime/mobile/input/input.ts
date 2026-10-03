import type { iInputAdapter } from '../../../tool/input/type';
import { HelperMediaQuery } from '../../shared/helpers/media-query.helper';

export const RuntimeMobileInput: iInputAdapter = {
  supportsPointerEvents() {
    return { value: typeof globalThis.PointerEvent !== 'undefined' };
  },

  matchesMediaQuery(query) {
    return { value: HelperMediaQuery.matches(query) };
  },

  subscribeMediaQuery(query, callback) {
    return HelperMediaQuery.subscribe(query, callback);
  },
};
