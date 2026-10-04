import type { Pinia } from 'pinia';
import { useAppThemeSetup } from '@/app/features/settings/composables/useAppThemeSetup';
import type { iSetup } from '@/core/app/setup/lifecycle/setupLifecycle.type';

export function createThemeSetup(pinia: Pinia): iSetup {
  const { setupAppTheme } = useAppThemeSetup(pinia);

  return {
    key: 'theme',

    async preMount() {
      await setupAppTheme();
    },
  };
}
