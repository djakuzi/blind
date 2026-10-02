import { HelperAudio } from './audio.helper';
import type {
  iAudioActionResult,
  iAudioAdapter,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
} from '../type';

type tAudioDataLoader = (src: string) => Promise<ArrayBuffer>;

interface iWebAudioResource {
  buffer: AudioBuffer;
  volume: number;
}

function createAdapter(loadAudioData: tAudioDataLoader): iAudioAdapter {
  let audioContext: AudioContext | undefined;
  let masterGain: GainNode | undefined;
  let muted = false;

  const resources = new Map<string, iWebAudioResource>();
  const preloadRequests = new Map<string, Promise<void>>();
  const activeSources = new Map<string, Set<AudioBufferSourceNode>>();
  const loopSources = new Map<string, AudioBufferSourceNode>();
  const activeLoops = new Map<string, iAudioResource>();

  function getAudioContext() {
    if (audioContext && audioContext.state !== 'closed') {
      return audioContext;
    }

    if (typeof AudioContext === 'undefined') {
      throw new Error('Web Audio API is not available');
    }

    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(muted ? 0 : 1, audioContext.currentTime);
    masterGain.connect(audioContext.destination);

    return audioContext;
  }

  function getMasterGain() {
    getAudioContext();

    if (!masterGain) {
      throw new Error('Web Audio master gain is not available');
    }

    return masterGain;
  }

  async function activate(): Promise<iAudioActionResult> {
    const context = getAudioContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    return {
      isHandled: context.state === 'running',
    };
  }

  function getResource(audio: iAudioResource) {
    const resource = resources.get(audio.id);

    if (!resource) {
      throw new Error(`Audio resource is not preloaded: ${audio.id}`);
    }

    return resource;
  }

  async function preloadResource(audio: iAudioPreloadResource) {
    if (resources.has(audio.id)) {
      return;
    }

    const activeRequest = preloadRequests.get(audio.id);

    if (activeRequest) {
      await activeRequest;
      return;
    }

    const request = (async () => {
      const context = getAudioContext();
      const data = await loadAudioData(audio.src);
      const buffer = await context.decodeAudioData(data);

      resources.set(audio.id, {
        buffer,
        volume: HelperAudio.normalizeVolume(audio.volume),
      });
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

  async function preload(audioResources: readonly iAudioPreloadResource[]) {
    await Promise.all(audioResources.map((audio) => preloadResource(audio)));

    return HelperAudio.createHandledResult();
  }

  function registerActiveSource(id: string, source: AudioBufferSourceNode) {
    const sources = activeSources.get(id) ?? new Set<AudioBufferSourceNode>();

    sources.add(source);
    activeSources.set(id, sources);

    return sources;
  }

  function stopSource(source: AudioBufferSourceNode) {
    try {
      source.stop();
    } catch {
      return;
    }
  }

  function stopActiveSources(id: string) {
    const sources = activeSources.get(id);

    if (!sources) {
      return;
    }

    activeSources.delete(id);

    for (const source of sources) {
      stopSource(source);
    }
  }

  function stopLoopSource(id: string) {
    const source = loopSources.get(id);

    if (!source) {
      return;
    }

    loopSources.delete(id);
    stopSource(source);
  }

  async function createSource(
    audio: iAudioResource,
    options: iAudioPlayOptions,
    isLoop: boolean,
  ) {
    const resource = getResource(audio);
    const context = getAudioContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    if (context.state !== 'running') {
      throw new Error('Web Audio context is not running');
    }

    const source = context.createBufferSource();
    const gain = context.createGain();

    source.buffer = resource.buffer;
    source.loop = isLoop;

    const volume = HelperAudio.normalizeVolume(options.volume ?? resource.volume);
    const offset = HelperAudio.normalizeTime(options.time);
    const delay = HelperAudio.normalizeTime(options.delay);

    gain.gain.setValueAtTime(volume, context.currentTime);

    source.connect(gain);
    gain.connect(getMasterGain());

    source.addEventListener(
      'ended',
      () => {
        if (isLoop) {
          if (loopSources.get(audio.id) === source) {
            loopSources.delete(audio.id);
          }
        } else {
          const sources = activeSources.get(audio.id);

          sources?.delete(source);

          if (sources?.size === 0) {
            activeSources.delete(audio.id);
          }
        }

        source.disconnect();
        gain.disconnect();
      },
      { once: true },
    );

    if (isLoop) {
      loopSources.set(audio.id, source);
    } else {
      registerActiveSource(audio.id, source);
    }

    source.start(context.currentTime + delay, offset);

    return source;
  }

  async function play(audio: iAudioResource, options: iAudioPlayOptions) {
    if (muted) {
      return HelperAudio.createHandledResult();
    }

    await createSource(audio, options, false);

    if (muted) {
      stopActiveSources(audio.id);
    }

    return HelperAudio.createHandledResult();
  }

  async function loop(audio: iAudioResource) {
    activeLoops.set(audio.id, audio);

    if (muted || loopSources.has(audio.id)) {
      return HelperAudio.createHandledResult();
    }

    await createSource(audio, {}, true);

    if (muted) {
      stopLoopSource(audio.id);
    }

    return HelperAudio.createHandledResult();
  }

  async function stop(audio: iAudioResource) {
    activeLoops.delete(audio.id);
    stopActiveSources(audio.id);
    stopLoopSource(audio.id);

    return HelperAudio.createHandledResult();
  }

  async function setMuted(value: boolean) {
    if (muted === value) {
      return HelperAudio.createHandledResult();
    }

    muted = value;

    if (masterGain && audioContext) {
      masterGain.gain.setValueAtTime(muted ? 0 : 1, audioContext.currentTime);
    }

    if (muted) {
      for (const id of [...activeSources.keys()]) {
        stopActiveSources(id);
      }

      for (const id of [...loopSources.keys()]) {
        stopLoopSource(id);
      }

      return HelperAudio.createHandledResult();
    }

    await Promise.all([...activeLoops.values()].map((audio) => loop(audio)));

    return HelperAudio.createHandledResult();
  }

  async function destroy() {
    await Promise.allSettled([...preloadRequests.values()]);

    for (const id of [...activeSources.keys()]) {
      stopActiveSources(id);
    }

    for (const id of [...loopSources.keys()]) {
      stopLoopSource(id);
    }

    activeLoops.clear();
    resources.clear();
    preloadRequests.clear();

    const context = audioContext;

    audioContext = undefined;
    masterGain = undefined;
    muted = false;

    if (context && context.state !== 'closed') {
      await context.close();
    }

    return HelperAudio.createHandledResult();
  }

  return {
    activate,
    preload,
    play,
    loop,
    stop,
    setMuted,
    destroy,
  };
}

async function loadWithFetch(src: string) {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`Failed to load audio resource: ${src}`);
  }

  return response.arrayBuffer();
}

export const HelperWebAudio = {
  createAdapter,
  loadWithFetch,
};
