import type { iPlatformSubscription, iPlatformValue } from '../../type';

export type tInputMediaQueryChangeCallback = (matches: boolean) => void;

export interface iInputAdapter {
  supportsPointerEvents(): iPlatformValue<boolean>;
  matchesMediaQuery(query: string): iPlatformValue<boolean>;
  subscribeMediaQuery(
    query: string,
    callback: tInputMediaQueryChangeCallback,
  ): iPlatformSubscription;
}
