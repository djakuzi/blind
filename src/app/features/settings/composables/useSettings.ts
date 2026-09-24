import { computed } from 'vue';
import type { tAppScalePresetMode } from '@/app/styles/contracts/appScale.contract';
import type { tAppThemeMode } from '@/app/styles/contracts/appTheme.contract';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { useLanguageStore } from '@/app/stores/language/language.store';
import { applyAppScaleMode } from '../helpers/applyAppScaleMode.helper';
import { applyAppThemeMode } from '../helpers/applyAppThemeMode.helper';

export interface iSettingsPatch {
  appThemeMode?: tAppThemeMode
  appScaleMode?: tAppScalePresetMode
  soundEnabled?: boolean
}

export function useSettings() {
  const settingsStore = useSettingsStore();
  const languageStore = useLanguageStore();

  const appThemeMode = computed(() =>
    settingsStore.appThemeMode,
  );

  const appScaleMode = computed(() =>
    settingsStore.appScaleMode,
  );

  const soundEnabled = computed(() =>
    settingsStore.soundEnabled,
  );

  const languages = computed(() =>
    languageStore.languages,
  );

  const currentLanguage = computed(() =>
    languageStore.currentLanguage,
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
    value: tAppScalePresetMode,
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

  async function setLanguage(
    value: string,
  ) {
    await languageStore.setLanguage(value);
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
    languages,
    currentLanguage,
    setAppThemeMode,
    setAppScaleMode,
    setSoundEnabled,
    setLanguage,
    toggleSoundEnabled,
    updateSettings,
  };
}
