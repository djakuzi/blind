import type { iVibrationAdapter, iVibrationResult } from '../type';

function createUnsupportedResult(): iVibrationResult {
  return {
    isHandled: false,
  };
}

export const DesktopVibrationAdapter: iVibrationAdapter = {
  async vibrate() {
    return createUnsupportedResult();
  },

  async impact() {
    return createUnsupportedResult();
  },

  async notification() {
    return createUnsupportedResult();
  },

  async selectionStart() {
    return createUnsupportedResult();
  },

  async selectionChanged() {
    return createUnsupportedResult();
  },

  async selectionEnd() {
    return createUnsupportedResult();
  },
};
