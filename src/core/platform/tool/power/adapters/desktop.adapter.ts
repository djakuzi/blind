import { HelperBridge } from '../../../runtime/desktop/helpers/bridge.helper';
import type { iPowerAdapter } from '../type';

export const DesktopPowerAdapter: iPowerAdapter = {
  async keepAwake() {
    await HelperBridge.getCapability('power').keepAwake();

    return {
      isHandled: true,
    };
  },

  async allowSleep() {
    await HelperBridge.getCapability('power').allowSleep();

    return {
      isHandled: true,
    };
  },
};
