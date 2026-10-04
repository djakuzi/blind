import { HelperWebPower } from '../helpers/web.helper';
import type { iPowerAdapter } from '../type';

export const WebPowerAdapter: iPowerAdapter = {
  async keepAwake() {
    return {
      isHandled: await HelperWebPower.keepAwake(),
    };
  },

  async allowSleep() {
    return {
      isHandled: await HelperWebPower.allowSleep(),
    };
  },
};
