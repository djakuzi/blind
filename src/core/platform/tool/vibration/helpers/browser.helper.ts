import type { iVibrationResult } from '../type';

function vibrate(pattern: readonly number[]): iVibrationResult {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return {
      isPerformed: false,
    };
  }

  try {
    return {
      isPerformed: navigator.vibrate([...pattern]),
    };
  } catch {
    return {
      isPerformed: false,
    };
  }
}

export const HelperBrowserVibration = {
  vibrate,
};
