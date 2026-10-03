import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopVibrationAdapter } from './adapters/desktop.adapter';
import { MobileVibrationAdapter } from './adapters/mobile.adapter';
import { WebVibrationAdapter } from './adapters/web.adapter';
import { createVibrationService } from './service';

export type {
  iVibrationAdapter,
  iVibrationImpactOptions,
  iVibrationNotificationOptions,
  iVibrationOptions,
  tVibrationImpactStyle,
  tVibrationNotificationType,
  tVibrationSelectionPhase,
} from './type';

const VibrationAdapter = resolveAdapter(
  {
    web: WebVibrationAdapter,
    mobile: MobileVibrationAdapter,
    desktop: DesktopVibrationAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export const {
  vibrate,
  impact,
  notification,
  selectionStart,
  selectionChanged,
  selectionEnd,
} = createVibrationService(VibrationAdapter);
