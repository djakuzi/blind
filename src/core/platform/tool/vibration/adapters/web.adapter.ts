import {
  BROWSER_VIBRATION_IMPACT_PATTERN,
  BROWSER_VIBRATION_NOTIFICATION_PATTERN,
  BROWSER_VIBRATION_SELECTION_PATTERN,
} from '../const';
import { HelperBrowserVibration } from '../helpers/browser.helper';
import type { iVibrationAdapter } from '../type';

export const WebVibrationAdapter: iVibrationAdapter = {
  async vibrate(duration) {
    return HelperBrowserVibration.vibrate([duration]);
  },

  async impact(style) {
    return HelperBrowserVibration.vibrate(
      BROWSER_VIBRATION_IMPACT_PATTERN[style],
    );
  },

  async notification(type) {
    return HelperBrowserVibration.vibrate(
      BROWSER_VIBRATION_NOTIFICATION_PATTERN[type],
    );
  },

  async selection(phase) {
    return HelperBrowserVibration.vibrate(
      BROWSER_VIBRATION_SELECTION_PATTERN[phase],
    );
  },
};
