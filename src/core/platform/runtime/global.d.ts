import type { iDesktopBridge } from './desktop/type';

declare global {
  interface Window {
    readonly blind?: iDesktopBridge;
  }
}

export {};
