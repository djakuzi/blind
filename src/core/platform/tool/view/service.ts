import type { iEnterViewFullscreenOptions, iViewAdapter } from './type';

export function createViewService(adapter: iViewAdapter) {
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

  function enterFullscreen(options: iEnterViewFullscreenOptions = {}) {
    return adapter.enterFullscreen(options);
  }

  async function toggleFullscreen(options: iEnterViewFullscreenOptions = {}) {
    const { value: fullscreen } = await adapter.isFullscreen();

    if (fullscreen) {
      return adapter.exitFullscreen();
    }

    return enterFullscreen(options);
  }

  return {
    getViewportRatio,
    setupView: adapter.setupView,
    isFullscreen: adapter.isFullscreen,
    enterFullscreen,
    exitFullscreen: adapter.exitFullscreen,
    toggleFullscreen,
  };
}
