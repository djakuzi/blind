import type { iSetup } from '@/core/app/setup/lifecycle/setupLifecycle.type';
import { ToolView } from '@/core/platform';

export function createViewSetup(): iSetup {
  return {
    key: 'view',

    async preMount() {
      await ToolView.setupView({
        orientation: 'landscape',
        isStatusBarVisible: false,
        isWebViewLimitedByStatusBar: false,
      });
    },
  };
}
