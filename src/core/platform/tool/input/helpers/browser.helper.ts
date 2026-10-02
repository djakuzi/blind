import type { iInputValue } from '../type';

function createValue<T>(value: T): iInputValue<T> {
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
