import {
  WEB_VIBRATION_IMPACT_PATTERN,
  WEB_VIBRATION_NOTIFICATION_PATTERN,
  WEB_VIBRATION_SELECTION_PATTERN,
} from '../const';
import { HelperBrowserVibration } from '../helpers/browser.helper';
import type { iVibrationAdapter } from '../type';

export const WebVibrationAdapter: iVibrationAdapter = {
  async vibrate(options) {
    return HelperBrowserVibration.vibrate([options.duration]);
  },

  async impact(options) {
    return HelperBrowserVibration.vibrate(WEB_VIBRATION_IMPACT_PATTERN[options.style]);
  },

  async notification(options) {
    return HelperBrowserVibration.vibrate(WEB_VIBRATION_NOTIFICATION_PATTERN[options.type]);
  },

  async selectionStart() {
    return HelperBrowserVibration.vibrate(WEB_VIBRATION_SELECTION_PATTERN.start);
  },

  async selectionChanged() {
    return HelperBrowserVibration.vibrate(WEB_VIBRATION_SELECTION_PATTERN.changed);
  },

  async selectionEnd() {
    return HelperBrowserVibration.vibrate(WEB_VIBRATION_SELECTION_PATTERN.end);
  },
};
