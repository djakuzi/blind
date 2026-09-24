import type { Pinia } from 'pinia';
import { useAppThemeSetup } from '@/app/features/settings/composables/useAppThemeSetup';
import type { iAppSetup } from '../core/setup.type';

export function createThemeSetup(
  pinia: Pinia,
): iAppSetup {
  const {
    setupAppTheme,
  } = useAppThemeSetup(pinia);

  return {
    key: 'theme',

    async preMount() {
      await setupAppTheme();
    },
  };
}
