import type { iPlatformValue } from '../../../type';

function createValue<T>(value: T): iPlatformValue<T> {
  return {
    value,
  };
}

function supportsPointerEvents() {
  return createValue(typeof globalThis.PointerEvent !== 'undefined');
}

export const HelperBrowserInput = {
  supportsPointerEvents,
};
