import type { iDesktopBridge } from './desktop/type/bridge.type';

declare global {
  interface Window {
    readonly blind?: iDesktopBridge;
  }
}

export {};
