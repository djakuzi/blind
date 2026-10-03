import type {
  iVibrationAdapter,
  tVibrationImpactStyle,
  tVibrationNotificationType,
  tVibrationSelectionPhase,
} from '../../../tool/vibration/type';

interface iDesktopHapticActuator {
  playEffect(
    type: 'dual-rumble',
    options: {
      duration: number;
      startDelay: number;
      weakMagnitude: number;
      strongMagnitude: number;
    },
  ): Promise<string>;
}

interface iDesktopHapticGamepad {
  vibrationActuator?: iDesktopHapticActuator | null;
}

interface iRumbleOptions {
  duration: number;
  weakMagnitude: number;
  strongMagnitude: number;
}

const IMPACT_RUMBLE: Record<tVibrationImpactStyle, iRumbleOptions> = {
  light: { duration: 35, weakMagnitude: 0.3, strongMagnitude: 0.1 },
  medium: { duration: 55, weakMagnitude: 0.55, strongMagnitude: 0.35 },
  heavy: { duration: 80, weakMagnitude: 0.75, strongMagnitude: 0.9 },
};

const NOTIFICATION_RUMBLE: Record<tVibrationNotificationType, iRumbleOptions> = {
  success: { duration: 70, weakMagnitude: 0.45, strongMagnitude: 0.3 },
  warning: { duration: 100, weakMagnitude: 0.55, strongMagnitude: 0.65 },
  error: { duration: 140, weakMagnitude: 0.7, strongMagnitude: 1 },
};

const SELECTION_RUMBLE: Record<tVibrationSelectionPhase, iRumbleOptions> = {
  start: { duration: 20, weakMagnitude: 0.25, strongMagnitude: 0.05 },
  changed: { duration: 28, weakMagnitude: 0.35, strongMagnitude: 0.08 },
  end: { duration: 16, weakMagnitude: 0.2, strongMagnitude: 0.04 },
};

async function rumble(options: iRumbleOptions) {
  if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
    return { isHandled: false };
  }

  const gamepads = navigator.getGamepads() as unknown as ArrayLike<iDesktopHapticGamepad | null>;

  for (const gamepad of Array.from(gamepads)) {
    const actuator = gamepad?.vibrationActuator;

    if (!actuator) {
      continue;
    }

    try {
      await actuator.playEffect('dual-rumble', {
        duration: options.duration,
        startDelay: 0,
        weakMagnitude: options.weakMagnitude,
        strongMagnitude: options.strongMagnitude,
      });

      return { isHandled: true };
    } catch {
      continue;
    }
  }

  return { isHandled: false };
}

export const RuntimeDesktopVibration: iVibrationAdapter = {
  vibrate(duration) {
    return rumble({
      duration,
      weakMagnitude: 0.7,
      strongMagnitude: 0.7,
    });
  },

  impact(style) {
    return rumble(IMPACT_RUMBLE[style]);
  },

  notification(type) {
    return rumble(NOTIFICATION_RUMBLE[type]);
  },

  selection(phase) {
    return rumble(SELECTION_RUMBLE[phase]);
  },
};
