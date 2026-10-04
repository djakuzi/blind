import { resolveRuntimeAdapter } from '../../adapter';
import { BrowserSystemAdapter } from './adapters/browser.adapter';
import { DesktopSystemAdapter } from './adapters/desktop.adapter';
import { MobileSystemAdapter } from './adapters/mobile.adapter';
import { createSystemTool } from './tool';

export type {
  iSystemAdapter,
  iSystemScale,
  tSystemThemeMode,
  tSystemThemeSource,
} from './type';

const SystemAdapter = resolveRuntimeAdapter({
  web: BrowserSystemAdapter,
  mobile: MobileSystemAdapter,
  desktop: DesktopSystemAdapter,
});

export const {
  getSystemLanguage,
  getSystemScale,
  getPreferredThemeMode,
  setThemeSource,
} = createSystemTool(SystemAdapter);
