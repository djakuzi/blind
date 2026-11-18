export interface iElectronAudioData {
  data: ArrayBuffer;
}

export interface iElectronAudioPlugin {
  loadAsset(src: string): Promise<iElectronAudioData>;
}
