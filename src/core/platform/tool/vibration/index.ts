import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopVibrationAdapter } from './adapters/desktop.adapter';
import { MobileVibrationAdapter } from './adapters/mobile.adapter';
import { WebVibrationAdapter } from './adapters/web.adapter';
import {
  DEFAULT_VIBRATION_DURATION,
  DEFAULT_VIBRATION_IMPACT_STYLE,
  DEFAULT_VIBRATION_NOTIFICATION_TYPE,
} from './const';
import { HelperDuration } from './helpers/duration.helper';
import type {
  iVibrationImpactOptions,
  iVibrationNotificationOptions,
  iVibrationOptions,
} from './type';

export type {
  iVibrationAdapter,
  iVibrationImpactOptions,
  iVibrationNotificationOptions,
  iVibrationOptions,
  iVibrationResult,
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

export function vibrate(options: iVibrationOptions = {}) {
  return VibrationAdapter.vibrate({
    duration: HelperDuration.normalizeDuration(options.duration ?? DEFAULT_VIBRATION_DURATION),
  });
}

export function impact(options: iVibrationImpactOptions = {}) {
  return VibrationAdapter.impact({
    style: options.style ?? DEFAULT_VIBRATION_IMPACT_STYLE,
  });
}

export function notification(options: iVibrationNotificationOptions = {}) {
  return VibrationAdapter.notification({
    type: options.type ?? DEFAULT_VIBRATION_NOTIFICATION_TYPE,
  });
}

export const {
  selectionStart,
  selectionChanged,
  selectionEnd,
} = VibrationAdapter;
