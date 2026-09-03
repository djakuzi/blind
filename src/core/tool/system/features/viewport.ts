export function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return 1;
  }

  return window.innerWidth / window.innerHeight;
}
