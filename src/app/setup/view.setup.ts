import { ToolSystem } from '@/core/tool/system';

export async function setupView() {
  await ToolSystem.setupView({
    orientation: 'landscape',
    isStatusBarVisible: false,
    isWebViewLimitedByStatusBar: false,
  });
}
