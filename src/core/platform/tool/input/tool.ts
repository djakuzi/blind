import {
  FINE_HOVER_POINTER_MEDIA_QUERY,
  FINE_POINTER_MEDIA_QUERY,
  HOVER_MEDIA_QUERY,
  PRIMARY_FINE_POINTER_MEDIA_QUERY,
} from './const';
import * as helpers from './helpers';

export function supportsPointerEvents() {
  return typeof globalThis.PointerEvent !== 'undefined';
}

export function canHover() {
  return helpers.matchesMediaQuery(HOVER_MEDIA_QUERY);
}

export function hasFinePointer() {
  return helpers.matchesMediaQuery(FINE_POINTER_MEDIA_QUERY);
}

export function hasFineHoverPointer() {
  return helpers.matchesMediaQuery(FINE_HOVER_POINTER_MEDIA_QUERY);
}

export function isPrimaryPointerFine() {
  return helpers.matchesMediaQuery(PRIMARY_FINE_POINTER_MEDIA_QUERY);
}

export function onFineHoverPointerChange(callback: (matches: boolean) => void) {
  return helpers.onMediaQueryChange(FINE_HOVER_POINTER_MEDIA_QUERY, callback);
}
