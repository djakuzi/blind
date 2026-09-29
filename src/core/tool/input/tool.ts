const HOVER_MEDIA_QUERY = '(any-hover: hover)';
const FINE_POINTER_MEDIA_QUERY = '(any-pointer: fine)';
const PRIMARY_FINE_POINTER_MEDIA_QUERY = '(pointer: fine)';

function matchesMediaQuery(query: string) {
  if (typeof globalThis.matchMedia !== 'function') {
    return false;
  }

  return globalThis.matchMedia(query).matches;
}

export function supportsPointerEvents() {
  return typeof globalThis.PointerEvent !== 'undefined';
}

export function canHover() {
  return matchesMediaQuery(HOVER_MEDIA_QUERY);
}

export function hasFinePointer() {
  return matchesMediaQuery(FINE_POINTER_MEDIA_QUERY);
}

export function isPrimaryPointerFine() {
  return matchesMediaQuery(PRIMARY_FINE_POINTER_MEDIA_QUERY);
}
