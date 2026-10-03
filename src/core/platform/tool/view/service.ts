import { HelperViewport } from '../../runtime/shared/helpers/viewport.helper';
import type { iEnterViewFullscreenOptions, iViewAdapter } from './type';

export function createViewService(adapter: iViewAdapter) {
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
    getViewportRatio: HelperViewport.getViewportRatio,
    setupView: adapter.setupView,
    isFullscreen: adapter.isFullscreen,
    enterFullscreen,
    exitFullscreen: adapter.exitFullscreen,
    toggleFullscreen,
  };
}
