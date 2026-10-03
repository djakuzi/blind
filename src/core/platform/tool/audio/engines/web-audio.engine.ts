import { HelperAudio } from './audio.helper';
import type { iPlatformActionResult } from '../../../type';
import type {
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
  const loopRequests = new Map<string, Promise<void>>();

  function getAudioContext() {
    if (audioContext && audioContext.state !== 'closed') {
      return audioContext;
    }

    if (typeof AudioContext === 'undefined') {
      throw new Error('Web Audio API is not available');
    }

    try {
      audioContext = new AudioContext({
        latencyHint: 'interactive',
      });
    } catch {
      audioContext = new AudioContext();
    }

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

  async function activate(): Promise<iPlatformActionResult> {
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
    const offset = Math.min(HelperAudio.normalizeTime(options.time), resource.buffer.duration);
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

  async function startLoop(audio: iAudioResource) {
    if (muted || !activeLoops.has(audio.id) || loopSources.has(audio.id)) {
      return;
    }

    const activeRequest = loopRequests.get(audio.id);

    if (activeRequest) {
      await activeRequest;
      return;
    }

    const request = (async () => {
      if (muted || !activeLoops.has(audio.id) || loopSources.has(audio.id)) {
        return;
      }

      await createSource(audio, {}, true);

      if (muted || !activeLoops.has(audio.id)) {
        stopLoopSource(audio.id);
      }
    })();

    loopRequests.set(audio.id, request);

    try {
      await request;
    } finally {
      if (loopRequests.get(audio.id) === request) {
        loopRequests.delete(audio.id);
      }
    }
  }

  async function loop(audio: iAudioResource) {
    activeLoops.set(audio.id, audio);

    await startLoop(audio);

    return HelperAudio.createHandledResult();
  }

  async function stop(audio: iAudioResource) {
    activeLoops.delete(audio.id);

    const activeLoopRequest = loopRequests.get(audio.id);

    if (activeLoopRequest) {
      await activeLoopRequest;
    }

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
      await Promise.allSettled([...loopRequests.values()]);

      for (const id of [...activeSources.keys()]) {
        stopActiveSources(id);
      }

      for (const id of [...loopSources.keys()]) {
        stopLoopSource(id);
      }

      return HelperAudio.createHandledResult();
    }

    await Promise.all([...activeLoops.values()].map((audio) => startLoop(audio)));

    return HelperAudio.createHandledResult();
  }

  async function destroy() {
    activeLoops.clear();

    await Promise.allSettled([
      ...preloadRequests.values(),
      ...loopRequests.values(),
    ]);

    for (const id of [...activeSources.keys()]) {
      stopActiveSources(id);
    }

    for (const id of [...loopSources.keys()]) {
      stopLoopSource(id);
    }

    resources.clear();
    preloadRequests.clear();
    loopRequests.clear();

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

export const WebAudioEngine = {
  createAdapter,
  loadWithFetch,
};
