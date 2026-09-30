export function matchesMediaQuery(query: string) {
  if (typeof globalThis.matchMedia !== 'function') {
    return false;
  }

  return globalThis.matchMedia(query).matches;
}

export function onMediaQueryChange(query: string, callback: (matches: boolean) => void) {
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
