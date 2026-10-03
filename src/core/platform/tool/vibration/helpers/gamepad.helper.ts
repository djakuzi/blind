interface iGamepadHapticActuator {
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

interface iHapticGamepad {
  vibrationActuator?: iGamepadHapticActuator | null;
}

export interface iGamepadRumbleOptions {
  duration: number;
  weakMagnitude: number;
  strongMagnitude: number;
}

async function rumble(options: iGamepadRumbleOptions) {
  if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
    return {
      isHandled: false,
    };
  }

  const gamepads =
    navigator.getGamepads() as unknown as ArrayLike<iHapticGamepad | null>;

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

      return {
        isHandled: true,
      };
    } catch {
      continue;
    }
  }

  return {
    isHandled: false,
  };
}

export const HelperGamepadVibration = {
  rumble,
};
