import { ToolStorage } from '@/core/platform';
import { SOUND_ENABLED_STORAGE_KEY } from '../settings.const';
import type { iSettingsState } from '../settings.type';

export function createLoadSoundEnabled() {
  return async function loadSoundEnabled(this: iSettingsState) {
    try {
      const { value } = await ToolStorage.getItem(SOUND_ENABLED_STORAGE_KEY);
      this.soundEnabled = value !== 'false';
    } catch (error) {
      console.error('Failed to load sound setting:', error);
      this.soundEnabled = false;
    }

    return this.soundEnabled;
  };
}
