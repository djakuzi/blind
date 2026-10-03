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

export type tAudioCompleteCallback = (assetId: string) => void;

export interface iAudioSubscription {
  unsubscribe(): Promise<void>;
}

export interface iAudioAdapter {
  activate(): Promise<iPlatformActionResult>;
  preloadResource(audio: iAudioPreloadResource): Promise<void>;
  playResource(audio: iAudioResource, options: iAudioPlayOptions): Promise<void>;
  startLoop(audio: iAudioResource): Promise<void>;
  stopResource(assetId: string): Promise<void>;
  subscribeComplete(callback: tAudioCompleteCallback): Promise<iAudioSubscription>;
  destroy(): Promise<void>;
}
