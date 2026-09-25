import { setLoaderResourceStatus } from '../loader.helper';
import type { iLoaderState, iSetLoaderResourceErrorPayload } from '../loader.type';

export function createSetResourceError() {
  return function setResourceError(this: iLoaderState, payload: iSetLoaderResourceErrorPayload) {
    setLoaderResourceStatus(this, payload, 'error', payload.error);
  };
}
