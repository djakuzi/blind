import type { iPlatformSubscription } from '../../../type';

type tMediaQueryChangeCallback = (matches: boolean) => void;

function matches(query: string) {
  if (typeof globalThis.matchMedia !== 'function') {
    return false;
  }

  return globalThis.matchMedia(query).matches;
}

function subscribe(
  query: string,
  callback: tMediaQueryChangeCallback,
): iPlatformSubscription {
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

export const HelperMediaQuery = {
  matches,
  subscribe,
};
