import type { iPlatformActionResult } from '../../../type';
import type {
  iAudioAdapter,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
  iAudioSubscription,
  tAudioCompleteCallback,
} from '../type';

interface iWebAudioResource {
  buffer: AudioBuffer;
  volume: number;
}

let audioContext: AudioContext | undefined;
let masterGain: GainNode | undefined;

const resources = new Map<string, iWebAudioResource>();
const activeSources = new Map<string, Set<AudioBufferSourceNode>>();
const loopSources = new Map<string, AudioBufferSourceNode>();
const completeCallbacks = new Set<tAudioCompleteCallback>();

function normalizeVolume(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 1;
  }

  return Math.min(1, Math.max(0, value));
}

function normalizeTime(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

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

function getResource(audio: iAudioResource) {
  const resource = resources.get(audio.id);

  if (!resource) {
    throw new Error(`Audio resource is not preloaded: ${audio.id}`);
  }

  return resource;
}

async function loadAudioData(src: string) {
  const response = await fetch(src);

  if (!response.ok) {
    throw new Error(`Failed to load audio resource: ${src}`);
  }

  return response.arrayBuffer();
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

  const volume = normalizeVolume(options.volume ?? resource.volume);
  const offset = Math.min(normalizeTime(options.time), resource.buffer.duration);
  const delay = normalizeTime(options.delay);

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

        for (const callback of completeCallbacks) {
          callback(audio.id);
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
    const sources = activeSources.get(audio.id) ?? new Set<AudioBufferSourceNode>();

    sources.add(source);
    activeSources.set(audio.id, sources);
  }

  source.start(context.currentTime + delay, offset);
}

export const WebAudioAdapter: iAudioAdapter = {
  async activate(): Promise<iPlatformActionResult> {
    const context = getAudioContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    return {
      isHandled: context.state === 'running',
    };
  },

  async preloadResource(audio: iAudioPreloadResource) {
    const context = getAudioContext();
    const data = await loadAudioData(audio.src);
    const buffer = await context.decodeAudioData(data);

    resources.set(audio.id, {
      buffer,
      volume: normalizeVolume(audio.volume),
    });
  },

  playResource(audio, options) {
    return createSource(audio, options, false);
  },

  startLoop(audio) {
    if (loopSources.has(audio.id)) {
      return Promise.resolve();
    }

    return createSource(audio, {}, true);
  },

  async stopResource(assetId) {
    stopActiveSources(assetId);
    stopLoopSource(assetId);
  },

  async subscribeComplete(callback): Promise<iAudioSubscription> {
    completeCallbacks.add(callback);

    return {
      async unsubscribe() {
        completeCallbacks.delete(callback);
      },
    };
  },

  async destroy() {
    for (const id of [...activeSources.keys()]) {
      stopActiveSources(id);
    }

    for (const id of [...loopSources.keys()]) {
      stopLoopSource(id);
    }

    resources.clear();
    completeCallbacks.clear();

    const context = audioContext;

    audioContext = undefined;
    masterGain = undefined;

    if (context && context.state !== 'closed') {
      await context.close();
    }
  },
};
