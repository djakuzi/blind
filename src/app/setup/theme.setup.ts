import type { Pinia } from 'pinia';

import { useAppThemeSetup } from '@/app/features/settings/composables/useAppThemeSetup';

export async function setupTheme(pinia: Pinia) {
  const { setupAppTheme } = useAppThemeSetup(pinia);

  await setupAppTheme();
}
