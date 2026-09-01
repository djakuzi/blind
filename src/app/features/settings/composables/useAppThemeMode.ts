import { computed } from 'vue';

import {
  APP_THEME_SYSTEM_MODE,
} from '@/app/styles/contracts/appTheme.contract';
import { useSettingsStore } from '@/app/stores/settings/settings.store';
import { ToolSystem } from '@/core/tool/system';

export function useAppThemeMode() {
  const settingsStore = useSettingsStore();

  const resolvedThemeMode = computed<ToolSystem.tSystemThemeMode>(() => {
    if (settingsStore.appThemeMode === APP_THEME_SYSTEM_MODE) {
      return ToolSystem.getPreferredThemeMode();
    }

    return settingsStore.appThemeMode;
  });

  return {
    resolvedThemeMode,
  };
}
