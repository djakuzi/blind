import { resolveRuntimeAdapter } from '../../adapter';
import { DesktopPowerAdapter } from './adapters/desktop.adapter';
import { MobilePowerAdapter } from './adapters/mobile.adapter';
import { WebPowerAdapter } from './adapters/web.adapter';
import { createPowerTool } from './tool';

export type { iPowerAdapter } from './type';

const PowerAdapter = resolveRuntimeAdapter({
  web: WebPowerAdapter,
  mobile: MobilePowerAdapter,
  desktop: DesktopPowerAdapter,
});

export const { keepAwake, allowSleep } = createPowerTool(PowerAdapter);
