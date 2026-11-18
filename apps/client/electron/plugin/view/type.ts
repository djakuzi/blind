export interface iElectronViewValue<T> {
  value: T;
}

export interface iElectronViewActionResult {
  isHandled: boolean;
}

export interface iElectronViewPlugin {
  isFullscreen(): Promise<iElectronViewValue<boolean>>;
  enterFullscreen(): Promise<iElectronViewActionResult>;
  exitFullscreen(): Promise<iElectronViewActionResult>;
}
