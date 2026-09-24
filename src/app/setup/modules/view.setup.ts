import { ToolView } from '@/core/tool/view';
import type { iAppSetup } from '../core/setup.type';

export function createViewSetup(): iAppSetup {
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
