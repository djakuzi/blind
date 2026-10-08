import { resolveRuntimeAdapter } from '../../adapter';
import { DesktopViewAdapter } from './adapters/desktop.adapter';
import { MobileViewAdapter } from './adapters/mobile.adapter';
import { WebViewAdapter } from './adapters/web.adapter';
import { createViewTool } from './tool';

export type { iEnterViewFullscreenOptions, iSetupViewOptions, iViewAdapter, tViewFullscreenNavigation, tViewOrientation } from './type';

const ViewAdapter = resolveRuntimeAdapter({
  web: WebViewAdapter,
  mobile: MobileViewAdapter,
  desktop: DesktopViewAdapter,
});

export const { getViewportRatio, setupView, isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen } = createViewTool(ViewAdapter);
