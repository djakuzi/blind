import { KeepAwake } from '@capawesome/capacitor-keep-awake';
import type { iPowerAdapter } from '../type';

async function perform(action: () => Promise<void>) {
  try {
    await action();

    return {
      isHandled: true,
    };
  } catch {
    return {
      isHandled: false,
    };
  }
}

export const MobilePowerAdapter: iPowerAdapter = {
  keepAwake() {
    return perform(() => KeepAwake.keepAwake());
  },

  allowSleep() {
    return perform(() => KeepAwake.allowSleep());
  },
};
