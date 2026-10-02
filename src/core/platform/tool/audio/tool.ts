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

let muted = false;
const activeAudioIds = new Set<string>();
const activeLoops = new Map<string, iAudioResource>();
const preloadedAudioIds = new Set<string>();
const preloadRequests = new Map<string, Promise<void>>();

export async function configure(options: iAudioConfigureOptions = {}) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await NativeAudio.configure(options);
}

function isAudioPreloadResourceList(
  input: iAudioPreloadResource | readonly iAudioPreloadResource[],
): input is readonly iAudioPreloadResource[] {
  return Array.isArray(input);
}

async function preloadResource(audio: iAudioPreloadResource) {
  if (preloadedAudioIds.has(audio.id)) {
    return;
  }

  const activeRequest = preloadRequests.get(audio.id);

  if (activeRequest !== undefined) {
    await activeRequest;
    return;
  }

  const options = {
    assetId: audio.id,
    assetPath: audio.src,
    audioChannelNum: audio.channels,
    volume: audio.volume,
    isUrl: false,
  };

  const request = (async () => {
    const { found } = await NativeAudio.isPreloaded(options);

    if (!found) {
      await NativeAudio.preload(options);
    }

    preloadedAudioIds.add(audio.id);
  })();

  preloadRequests.set(audio.id, request);

  try {
    await request;
  } finally {
    if (preloadRequests.get(audio.id) === request) {
      preloadRequests.delete(audio.id);
    }
  }
}

export async function preload(audio: iAudioPreloadResource | readonly iAudioPreloadResource[]) {
  const resources = isAudioPreloadResourceList(audio) ? audio : [audio];

  await Promise.all(resources.map((resource) => preloadResource(resource)));
}

export async function play(audio: iAudioResource, options: iAudioPlayOptions = {}) {
  if (muted) {
    return;
  }

  await NativeAudio.play({
    assetId: audio.id,
    ...options,
  });

  if (muted) {
    await NativeAudio.stop({ assetId: audio.id });
    return;
  }

  activeAudioIds.add(audio.id);
}

export async function playOnce(options: iAudioPlayOnceOptions) {
  if (muted) {
    return;
  }

  const result = await NativeAudio.playOnce({
    assetPath: options.src,
    volume: options.volume,
    isUrl: false,
  });

  if (muted) {
    await NativeAudio.stop({ assetId: result.assetId });
  }

  return result;
}

export async function pause(audio: iAudioResource) {
  await NativeAudio.pause({ assetId: audio.id });
}

export async function resume(audio: iAudioResource) {
  if (muted) {
    return;
  }

  await NativeAudio.resume({ assetId: audio.id });
}

export async function loop(audio: iAudioResource) {
  activeLoops.set(audio.id, audio);

  if (muted) {
    return;
  }

  await NativeAudio.loop({ assetId: audio.id });

  if (muted) {
    await NativeAudio.stop({ assetId: audio.id });
  }
}

export async function stop(audio: iAudioResource) {
  activeAudioIds.delete(audio.id);
  activeLoops.delete(audio.id);

  await NativeAudio.stop({ assetId: audio.id });
}

export async function unload(audio: iAudioResource) {
  activeAudioIds.delete(audio.id);
  activeLoops.delete(audio.id);

  const preloadRequest = preloadRequests.get(audio.id);

  if (preloadRequest !== undefined) {
    await preloadRequest;
  }

  await NativeAudio.unload({ assetId: audio.id });

  preloadedAudioIds.delete(audio.id);
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

export function isMuted() {
  return muted;
}

export async function setMuted(value: boolean) {
  if (muted === value) {
    return;
  }

  muted = value;

  if (muted) {
    const audioIds = new Set([...activeAudioIds, ...activeLoops.keys()]);

    await Promise.all([...audioIds].map((id) => NativeAudio.stop({ assetId: id })));

    activeAudioIds.clear();
    return;
  }

  await Promise.all([...activeLoops.values()].map((audio) => NativeAudio.loop({ assetId: audio.id })));
}

export async function destroy() {
  await Promise.allSettled([...preloadRequests.values()]);

  activeAudioIds.clear();
  activeLoops.clear();
  preloadedAudioIds.clear();
  preloadRequests.clear();

  await NativeAudio.deinitPlugin();
}
