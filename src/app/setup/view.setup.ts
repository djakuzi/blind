import { ToolView } from '@/core/tool/view';

export async function setupView() {
  await ToolView.setupView({
    orientation: 'landscape',
    isStatusBarVisible: false,
    isWebViewLimitedByStatusBar: false,
  });
}
