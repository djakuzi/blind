export type tElectronSystemThemeSource = 'system' | 'light' | 'dark';

export interface iElectronSystemValue<T> {
  value: T;
}

export interface iElectronSystemPlugin {
  getLanguage(): Promise<iElectronSystemValue<string>>;
  getScale(): Promise<iElectronSystemValue<number>>;
  setThemeSource(themeSource: tElectronSystemThemeSource): Promise<void>;
}
