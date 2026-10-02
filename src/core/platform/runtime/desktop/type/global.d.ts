import type { iDesktopBridge } from './bridge.type';

declare global {
  interface Window {
    readonly blind?: iDesktopBridge;
  }
}

export {};
