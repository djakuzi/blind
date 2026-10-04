import type { iPowerAdapter } from './type';

export function createPowerTool(adapter: iPowerAdapter) {
  return {
    keepAwake: adapter.keepAwake,
    allowSleep: adapter.allowSleep,
  };
}
