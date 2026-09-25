import { setLoaderResourceStatus } from '../loader.helper';
import type { iLoaderResourcePayload, iLoaderState } from '../loader.type';

export function createSetResourcePending() {
  return function setResourcePending(this: iLoaderState, payload: iLoaderResourcePayload) {
    setLoaderResourceStatus(this, payload, 'pending');
  };
}
