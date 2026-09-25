import type { Pinia } from 'pinia';
import { useAppScaleSetup } from '@/app/features/settings/composables/useAppScaleSetup';
import type { iSetup } from '@/core/app/setup/setup.type';

export function createScaleSetup(pinia: Pinia): iSetup {
  const { setupAppScale } = useAppScaleSetup(pinia);

  return {
    key: 'scale',

    async preMount() {
      await setupAppScale();
    },
  };
}
