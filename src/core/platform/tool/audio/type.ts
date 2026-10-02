import type { iPlatformActionResult } from '../../type';

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
  activate(): Promise<iPlatformActionResult>;
  preload(resources: readonly iAudioPreloadResource[]): Promise<iPlatformActionResult>;
  play(audio: iAudioResource, options: iAudioPlayOptions): Promise<iPlatformActionResult>;
  loop(audio: iAudioResource): Promise<iPlatformActionResult>;
  stop(audio: iAudioResource): Promise<iPlatformActionResult>;
  setMuted(value: boolean): Promise<iPlatformActionResult>;
  destroy(): Promise<iPlatformActionResult>;
}
