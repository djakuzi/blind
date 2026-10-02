import type { iInputSubscription, iInputValue, tInputMediaQueryChangeCallback } from '../type';

function createValue<T>(value: T): iInputValue<T> {
  return {
    value,
  };
}

function supportsPointerEvents() {
  return createValue(typeof globalThis.PointerEvent !== 'undefined');
}

function matchesMediaQuery(query: string) {
  if (typeof globalThis.matchMedia !== 'function') {
    return createValue(false);
  }

  return createValue(globalThis.matchMedia(query).matches);
}

function onMediaQueryChange(query: string, callback: tInputMediaQueryChangeCallback): iInputSubscription {
  if (typeof globalThis.matchMedia !== 'function') {
    return {
      unsubscribe() {},
    };
  }

  const mediaQueryList = globalThis.matchMedia(query);

  function handleChange(event: MediaQueryListEvent) {
    callback(event.matches);
  }

  mediaQueryList.addEventListener('change', handleChange);

  return {
    unsubscribe() {
      mediaQueryList.removeEventListener('change', handleChange);
    },
  };
}

export const HelperBrowserInput = {
  supportsPointerEvents,
  matchesMediaQuery,
  onMediaQueryChange,
};
