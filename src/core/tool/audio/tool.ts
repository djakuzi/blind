import { Capacitor } from '@capacitor/core';
import { NativeAudio } from '@capgo/capacitor-native-audio';
import type {
  iAudioConfigureOptions,
  iAudioPlayOnceOptions,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
  iAudioVolumeOptions,
} from './type';

export async function configure(options: iAudioConfigureOptions = {}) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await NativeAudio.configure(options);
}

export async function preload(audio: iAudioPreloadResource) {
  await NativeAudio.preload({
    assetId: audio.id,
    assetPath: audio.src,
    audioChannelNum: audio.channels,
    volume: audio.volume,
    isUrl: false,
  });
}

export async function play(audio: iAudioResource, options: iAudioPlayOptions = {}) {
  await NativeAudio.play({
    assetId: audio.id,
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

export async function pause(audio: iAudioResource) {
  await NativeAudio.pause({ assetId: audio.id });
}

export async function resume(audio: iAudioResource) {
  await NativeAudio.resume({ assetId: audio.id });
}

export async function loop(audio: iAudioResource) {
  await NativeAudio.loop({ assetId: audio.id });
}

export async function stop(audio: iAudioResource) {
  await NativeAudio.stop({ assetId: audio.id });
}

export async function unload(audio: iAudioResource) {
  await NativeAudio.unload({ assetId: audio.id });
}

export async function setVolume(audio: iAudioResource, options: iAudioVolumeOptions) {
  await NativeAudio.setVolume({
    assetId: audio.id,
    volume: options.volume,
  });
}

export async function isPlaying(audio: iAudioResource) {
  return NativeAudio.isPlaying({ assetId: audio.id });
}

export async function destroy() {
  await NativeAudio.deinitPlugin();
}
