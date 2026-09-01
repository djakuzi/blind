import type { Pinia } from 'pinia';

import { useAppScaleSetup } from '@/app/features/settings/composables/useAppScaleSetup';

export async function setupScale(pinia: Pinia) {
  const { setupAppScale } = useAppScaleSetup(pinia);

  await setupAppScale();
}
