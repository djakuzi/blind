import type { iLoaderState } from '../loader.type';

export function createResetLoader() {
  return function reset(this: iLoaderState) {
    this.scopes = {};
    this.errors = [];
  };
}
