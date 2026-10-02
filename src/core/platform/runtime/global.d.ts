import type { iBlindBridge } from './type';

declare global {
  interface Window {
    readonly blind?: iBlindBridge;
  }
}

export {};
