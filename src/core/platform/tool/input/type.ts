import type { iPlatformSubscription, iPlatformValue } from '../../type';

export type tInputMediaQueryChangeCallback = (matches: boolean) => void;

export interface iInputAdapter {
  supportsPointerEvents(): iPlatformValue<boolean>;
  canHover(): iPlatformValue<boolean>;
  hasFinePointer(): iPlatformValue<boolean>;
  hasFineHoverPointer(): iPlatformValue<boolean>;
  isPrimaryPointerFine(): iPlatformValue<boolean>;
  onFineHoverPointerChange(callback: tInputMediaQueryChangeCallback): iPlatformSubscription;
}
