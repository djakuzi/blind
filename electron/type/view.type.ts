export interface iElectronViewValue<T> {
  value: T;
}

export interface iElectronViewActionResult {
  isHandled: boolean;
}

export interface iElectronViewBridge {
  isFullscreen(): Promise<iElectronViewValue<boolean>>;
  enterFullscreen(): Promise<iElectronViewActionResult>;
  exitFullscreen(): Promise<iElectronViewActionResult>;
}
