const HOVER_MEDIA_QUERY = '(any-hover: hover)';
const FINE_POINTER_MEDIA_QUERY = '(any-pointer: fine)';
const FINE_HOVER_POINTER_MEDIA_QUERY = '(any-hover: hover) and (any-pointer: fine)';
const PRIMARY_FINE_POINTER_MEDIA_QUERY = '(pointer: fine)';

function matchesMediaQuery(query: string) {
  if (typeof globalThis.matchMedia !== 'function') {
    return false;
  }

  return globalThis.matchMedia(query).matches;
}

function onMediaQueryChange(query: string, callback: (matches: boolean) => void) {
  if (typeof globalThis.matchMedia !== 'function') {
    return () => {};
  }

  const mediaQueryList = globalThis.matchMedia(query);

  function handleChange(event: MediaQueryListEvent) {
    callback(event.matches);
  }

  mediaQueryList.addEventListener('change', handleChange);

  return () => {
    mediaQueryList.removeEventListener('change', handleChange);
  };
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

export function hasFineHoverPointer() {
  return matchesMediaQuery(FINE_HOVER_POINTER_MEDIA_QUERY);
}

export function isPrimaryPointerFine() {
  return matchesMediaQuery(PRIMARY_FINE_POINTER_MEDIA_QUERY);
}

export function onFineHoverPointerChange(callback: (matches: boolean) => void) {
  return onMediaQueryChange(FINE_HOVER_POINTER_MEDIA_QUERY, callback);
}
