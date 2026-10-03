import { HelperMediaQuery } from '../../shared/helpers/media-query.helper';
import type { iInputAdapter } from '../../../tool/input/type';

const HOVER_MEDIA_QUERY = '(any-hover: hover)';
const FINE_POINTER_MEDIA_QUERY = '(any-pointer: fine)';
const FINE_HOVER_POINTER_MEDIA_QUERY = '(any-hover: hover) and (any-pointer: fine)';
const PRIMARY_FINE_POINTER_MEDIA_QUERY = '(pointer: fine)';

export const RuntimeWebInput: iInputAdapter = {
  supportsPointerEvents() {
    return { value: typeof globalThis.PointerEvent !== 'undefined' };
  },
  canHover() {
    return { value: HelperMediaQuery.matches(HOVER_MEDIA_QUERY) };
  },
  hasFinePointer() {
    return { value: HelperMediaQuery.matches(FINE_POINTER_MEDIA_QUERY) };
  },
  hasFineHoverPointer() {
    return { value: HelperMediaQuery.matches(FINE_HOVER_POINTER_MEDIA_QUERY) };
  },
  isPrimaryPointerFine() {
    return { value: HelperMediaQuery.matches(PRIMARY_FINE_POINTER_MEDIA_QUERY) };
  },
  onFineHoverPointerChange(callback) {
    return HelperMediaQuery.subscribe(FINE_HOVER_POINTER_MEDIA_QUERY, callback);
  },
};
