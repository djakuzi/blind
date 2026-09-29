import { Capacitor } from '@capacitor/core';
import { NativeAudio } from '@capgo/capacitor-native-audio';
import type {
  iAudioConfigureOptions,
  iAudioPlayOnceOptions,
  iAudioPlayOptions,
  iAudioPreloadOptions,
  iAudioVolumeOptions,
} from './type';

export async function configure(options: iAudioConfigureOptions = {}) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await NativeAudio.configure(options);
}

export async function preload(options: iAudioPreloadOptions) {
  await NativeAudio.preload({
    assetId: options.id,
    assetPath: options.src,
    audioChannelNum: options.channels,
    volume: options.volume,
    isUrl: false,
  });
}

export async function play(id: string, options: iAudioPlayOptions = {}) {
  await NativeAudio.play({
    assetId: id,
    ...options,
  });
}

export async function playOnce(options: iAudioPlayOnceOptions) {
  return NativeAudio.playOnce({
    assetPath: options.src,
    volume: options.volume,
    isUrl: false,
  });
}

export async function pause(id: string) {
  await NativeAudio.pause({ assetId: id });
}

export async function resume(id: string) {
  await NativeAudio.resume({ assetId: id });
}

export async function loop(id: string) {
  await NativeAudio.loop({ assetId: id });
}

export async function stop(id: string) {
  await NativeAudio.stop({ assetId: id });
}

export async function unload(id: string) {
  await NativeAudio.unload({ assetId: id });
}

export async function setVolume(id: string, options: iAudioVolumeOptions) {
  await NativeAudio.setVolume({
    assetId: id,
    volume: options.volume,
  });
}

export async function isPlaying(id: string) {
  return NativeAudio.isPlaying({ assetId: id });
}

export async function destroy() {
  await NativeAudio.deinitPlugin();
}
