import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopViewAdapter } from './adapters/desktop.adapter';
import { MobileViewAdapter } from './adapters/mobile.adapter';
import { WebViewAdapter } from './adapters/web.adapter';
import { createViewService } from './service';

export type {
  iEnterViewFullscreenOptions,
  iSetupViewOptions,
  iViewAdapter,
  tViewFullscreenNavigation,
  tViewOrientation,
} from './type';

const ViewAdapter = resolveAdapter(
  {
    web: WebViewAdapter,
    mobile: MobileViewAdapter,
    desktop: DesktopViewAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export const {
  getViewportRatio,
  setupView,
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
  toggleFullscreen,
} = createViewService(ViewAdapter);
