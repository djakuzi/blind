import { computed } from 'vue';
import type {
  tAppScaleMode,
} from '@/app/styles/contracts/appScale.contract';
import type {
  tAppThemeMode,
} from '@/app/styles/contracts/appTheme.contract';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { applyAppScaleMode } from '../helpers/applyAppScaleMode.helper';
import { applyAppThemeMode } from '../helpers/applyAppThemeMode.helper';

export interface iSettingsPatch {
  appThemeMode?: tAppThemeMode
  appScaleMode?: tAppScaleMode
  soundEnabled?: boolean
}

export function useSettings() {
  const settingsStore = useSettingsStore();

  const appThemeMode = computed(() =>
    settingsStore.appThemeMode,
  );

  const appScaleMode = computed(() =>
    settingsStore.appScaleMode,
  );

  const soundEnabled = computed(() =>
    settingsStore.soundEnabled,
  );

  async function setAppThemeMode(
    value: tAppThemeMode,
  ) {
    const savePromise =
      settingsStore.setAppThemeMode(value);

    applyAppThemeMode(value);

    await savePromise;
  }

  async function setAppScaleMode(
    value: tAppScaleMode,
  ) {
    await Promise.all([
      settingsStore.setAppScaleMode(value),
      applyAppScaleMode(value),
    ]);
  }

  function setSoundEnabled(
    value: boolean,
  ) {
    settingsStore.setSoundEnabled(value);
  }

  function toggleSoundEnabled() {
    setSoundEnabled(
      !settingsStore.soundEnabled,
    );
  }

  async function updateSettings(
    patch: iSettingsPatch,
  ) {
    const operations: Promise<void>[] = [];

    if (patch.appThemeMode !== undefined) {
      operations.push(
        setAppThemeMode(patch.appThemeMode),
      );
    }

    if (patch.appScaleMode !== undefined) {
      operations.push(
        setAppScaleMode(patch.appScaleMode),
      );
    }

    if (patch.soundEnabled !== undefined) {
      setSoundEnabled(patch.soundEnabled);
    }

    await Promise.all(operations);
  }

  return {
    appThemeMode,
    appScaleMode,
    soundEnabled,
    setAppThemeMode,
    setAppScaleMode,
    setSoundEnabled,
    toggleSoundEnabled,
    updateSettings,
  };
}
