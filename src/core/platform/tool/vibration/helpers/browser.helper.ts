import type { iPlatformActionResult } from '../../../type';

function vibrate(pattern: readonly number[]): iPlatformActionResult {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return {
      isHandled: false,
    };
  }

  try {
    return {
      isHandled: navigator.vibrate([...pattern]),
    };
  } catch {
    return {
      isHandled: false,
    };
  }
}

export const HelperBrowserVibration = {
  vibrate,
};
