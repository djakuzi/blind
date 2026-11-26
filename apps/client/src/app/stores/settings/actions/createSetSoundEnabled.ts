import { ToolStorage } from '@/core/platform';
import { SOUND_ENABLED_STORAGE_KEY } from '../settings.const';
import type { iSettingsState } from '../settings.type';

export function createSetSoundEnabled() {
  let pendingSave = Promise.resolve();
  let latestChange = 0;

  return async function setSoundEnabled(this: iSettingsState, soundEnabled: boolean) {
    this.soundEnabled = soundEnabled;
    const change = ++latestChange;

    const save = pendingSave.catch(() => {}).then(() => ToolStorage.setItem(SOUND_ENABLED_STORAGE_KEY, String(soundEnabled)));
    pendingSave = save;
    try {
      await save;
      if (change === latestChange) {
        this.soundSaveError = false;
      }
    } catch (error) {
      if (change === latestChange) {
        this.soundSaveError = true;
      }
      throw error;
    }
  };
}
