import {
  GAMEPAD_VIBRATION_IMPACT,
  GAMEPAD_VIBRATION_NOTIFICATION,
  GAMEPAD_VIBRATION_SELECTION,
} from '../const';
import { HelperGamepadVibration } from '../helpers/gamepad.helper';
import type { iVibrationAdapter } from '../type';

export const DesktopVibrationAdapter: iVibrationAdapter = {
  vibrate(duration) {
    return HelperGamepadVibration.rumble({
      duration,
      weakMagnitude: 0.7,
      strongMagnitude: 0.7,
    });
  },

  impact(style) {
    return HelperGamepadVibration.rumble(
      GAMEPAD_VIBRATION_IMPACT[style],
    );
  },

  notification(type) {
    return HelperGamepadVibration.rumble(
      GAMEPAD_VIBRATION_NOTIFICATION[type],
    );
  },

  selection(phase) {
    return HelperGamepadVibration.rumble(
      GAMEPAD_VIBRATION_SELECTION[phase],
    );
  },
};
