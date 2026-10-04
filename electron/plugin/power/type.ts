export interface iElectronPowerPlugin {
  keepAwake(): Promise<void>;
  allowSleep(): Promise<void>;
}
