export interface iAudioConfigureOptions {
  focus?: boolean;
  background?: boolean;
  ignoreSilent?: boolean;
  showNotification?: boolean;
}

export interface iAudioPreloadOptions {
  id: string;
  src: string;
  channels?: number;
  volume?: number;
}

export interface iAudioPlayOptions {
  volume?: number;
  time?: number;
  delay?: number;
}

export interface iAudioPlayOnceOptions {
  src: string;
  volume?: number;
}

export interface iAudioVolumeOptions {
  volume: number;
}
