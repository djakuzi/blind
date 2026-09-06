import type { iSettingsState } from '../settings.type';

export function createSetSoundEnabled() {
  return function setSoundEnabled(
    this: iSettingsState,
    soundEnabled: boolean,
  ) {
    this.soundEnabled = soundEnabled;
  };
}
