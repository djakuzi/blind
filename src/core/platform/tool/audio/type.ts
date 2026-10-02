export interface iAudioActionResult {
  isHandled: boolean;
}

export interface iAudioResource {
  id: string;
}

export interface iAudioPreloadResource extends iAudioResource {
  src: string;
  channels?: number;
  volume?: number;
}

export interface iAudioPlayOptions {
  volume?: number;
  time?: number;
  delay?: number;
}

export interface iAudioAdapter {
  activate(): Promise<iAudioActionResult>;
  preload(resources: readonly iAudioPreloadResource[]): Promise<iAudioActionResult>;
  play(audio: iAudioResource, options: iAudioPlayOptions): Promise<iAudioActionResult>;
  loop(audio: iAudioResource): Promise<iAudioActionResult>;
  stop(audio: iAudioResource): Promise<iAudioActionResult>;
  setMuted(value: boolean): Promise<iAudioActionResult>;
  destroy(): Promise<iAudioActionResult>;
}
