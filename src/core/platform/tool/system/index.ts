import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopSystemAdapter } from './adapters/desktop.adapter';
import { MobileSystemAdapter } from './adapters/mobile.adapter';
import { WebSystemAdapter } from './adapters/web.adapter';
import { createSystemService } from './service';

export type { iSystemAdapter, iSystemScale, tSystemThemeMode } from './type';

const SystemAdapter = resolveAdapter(
  {
    web: WebSystemAdapter,
    mobile: MobileSystemAdapter,
    desktop: DesktopSystemAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export const {
  getSystemLanguage,
  getSystemScale,
  getPreferredThemeMode,
} = createSystemService(SystemAdapter);
