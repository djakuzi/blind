import { setLoaderResourceStatus } from '../loader.helper';
import type { iLoaderResourcePayload, iLoaderState } from '../loader.type';

export function createSetResourceLoaded() {
  return function setResourceLoaded(this: iLoaderState, payload: iLoaderResourcePayload) {
    setLoaderResourceStatus(this, payload, 'loaded');
  };
}
