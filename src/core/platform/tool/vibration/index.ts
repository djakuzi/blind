import { resolveRuntimeAdapter } from '../../adapter';
import { DesktopVibrationAdapter } from './adapters/desktop.adapter';
import { MobileVibrationAdapter } from './adapters/mobile.adapter';
import { WebVibrationAdapter } from './adapters/web.adapter';
import { createVibrationTool } from './tool';

export type {
  iVibrationAdapter,
  iVibrationImpactOptions,
  iVibrationNotificationOptions,
  iVibrationOptions,
  tVibrationImpactStyle,
  tVibrationNotificationType,
  tVibrationSelectionPhase,
} from './type';

const VibrationAdapter = resolveRuntimeAdapter({
  web: WebVibrationAdapter,
  mobile: MobileVibrationAdapter,
  desktop: DesktopVibrationAdapter,
});

export const {
  vibrate,
  impact,
  notification,
  selectionStart,
  selectionChanged,
  selectionEnd,
} = createVibrationTool(VibrationAdapter);
