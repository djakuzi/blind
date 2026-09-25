import type { Pinia } from 'pinia';
import { useAppScaleSetup } from '@/app/features/settings/composables/useAppScaleSetup';
import type { iAppSetup } from '../core/setup.type';

export function createScaleSetup(
  pinia: Pinia,
): iAppSetup {
  const { setupAppScale } = useAppScaleSetup(pinia);

  return {
    key: 'scale',

    async preMount() {
      await setupAppScale();
    },
  };
}
