import type { Pinia } from 'pinia';

import { useAppFontSizeSetup } from '@/app/features/settings/composables/useAppFontSizeSetup';

export async function setupFontSize(pinia: Pinia) {
  const { setupAppFontSize } = useAppFontSizeSetup(pinia);

  await setupAppFontSize();
}
