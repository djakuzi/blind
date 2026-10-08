import type { iEnterViewFullscreenOptions, iSetupViewOptions, iViewAdapter } from './type';

export function createViewTool(adapter: iViewAdapter) {
  function getViewportRatio() {
    const { value } = adapter.getViewportSize();

    if (value.height === 0) {
      return {
        value: 1,
      };
    }

    return {
      value: value.width / value.height,
    };
  }

  async function setupView(options: iSetupViewOptions) {
    const results = [];

    if (options.orientation !== undefined) {
      results.push(await adapter.setOrientation(options.orientation));
    }

    if (options.isWebViewLimitedByStatusBar !== undefined) {
      results.push(await adapter.setWebViewLimitedByStatusBar(options.isWebViewLimitedByStatusBar));
    }

    if (options.isStatusBarVisible !== undefined) {
      results.push(await adapter.setStatusBarVisible(options.isStatusBarVisible));
    }

    return {
      isHandled: results.every((result) => result.isHandled),
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
    setupView,
    isFullscreen: adapter.isFullscreen,
    enterFullscreen,
    exitFullscreen: adapter.exitFullscreen,
    toggleFullscreen,
  };
}
