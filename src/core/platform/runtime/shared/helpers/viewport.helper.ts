function getViewportRatio() {
  if (typeof window === 'undefined' || window.innerHeight === 0) {
    return {
      value: 1,
    };
  }

  return {
    value: window.innerWidth / window.innerHeight,
  };
}

export const HelperViewport = {
  getViewportRatio,
};
