export interface iElectronAudioData {
  data: ArrayBuffer;
}

export interface iElectronAudioBridge {
  loadAsset(src: string): Promise<iElectronAudioData>;
}
