import type { iPlatformSubscription } from '../../../type';
import { HelperAudio } from '../helpers/audio.helper';
import type {
  iAudioAdapter,
  iAudioLoopOptions,
  iAudioLoopVolumeOptions,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
  tAudioCompleteCallback,
} from '../type';

type tAudioDataLoader = (src: string) => Promise<ArrayBuffer>;

interface iWebAudioResource {
  buffer: AudioBuffer;
}

interface iWebAudioLoopSource {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

export function createWebAudioEngine(loadAudioData: tAudioDataLoader): iAudioAdapter {
  let audioContext: AudioContext | undefined;
  let masterGain: GainNode | undefined;

  const resources = new Map<string, iWebAudioResource>();
  const activeSources = new Map<string, Set<AudioBufferSourceNode>>();
  const loopSources = new Map<string, iWebAudioLoopSource>();
  const completeCallbacks = new Set<tAudioCompleteCallback>();

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
    const loop = loopSources.get(id);

    if (!loop) {
      return;
    }

    loopSources.delete(id);
    stopSource(loop.source);
  }

  async function createSource(audio: iAudioResource, options: iAudioPlayOptions, isLoop: boolean) {
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

    const volume = HelperAudio.normalizeVolume(audio.volume) * HelperAudio.normalizeVolume(options.volume);
    const offset = Math.min(HelperAudio.normalizeTime(options.time), resource.buffer.duration);
    const delay = HelperAudio.normalizeTime(options.delay);

    gain.gain.setValueAtTime(volume, context.currentTime);
    source.connect(gain);
    gain.connect(getMasterGain());

    source.addEventListener(
      'ended',
      () => {
        if (isLoop) {
          if (loopSources.get(audio.id)?.source === source) {
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
      loopSources.set(audio.id, {
        source,
        gain,
      });
    } else {
      const sources = activeSources.get(audio.id) ?? new Set<AudioBufferSourceNode>();

      sources.add(source);
      activeSources.set(audio.id, sources);
    }

    source.start(context.currentTime + delay, offset);
  }

  return {
    async activate() {
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
      });
    },

    playResource(audio, options) {
      return createSource(audio, options, false);
    },

    startLoop(audio, options: iAudioLoopOptions) {
      if (loopSources.has(audio.id)) {
        return Promise.resolve();
      }

      return createSource(audio, options, true);
    },

    async setLoopVolume(audio: iAudioResource, options: iAudioLoopVolumeOptions) {
      const loop = loopSources.get(audio.id);

      if (!loop) {
        return;
      }

      const context = getAudioContext();
      const volume = HelperAudio.normalizeVolume(audio.volume) * HelperAudio.normalizeVolume(options.volume);
      const duration = HelperAudio.normalizeTime(options.duration);
      const now = context.currentTime;

      loop.gain.gain.cancelScheduledValues(now);
      loop.gain.gain.setValueAtTime(loop.gain.gain.value, now);

      if (duration > 0) {
        loop.gain.gain.linearRampToValueAtTime(volume, now + duration);
        return;
      }

      loop.gain.gain.setValueAtTime(volume, now);
    },

    async stopResource(assetId) {
      stopActiveSources(assetId);
      stopLoopSource(assetId);
    },

    async subscribeComplete(callback: tAudioCompleteCallback): Promise<iPlatformSubscription> {
      completeCallbacks.add(callback);

      return {
        unsubscribe() {
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
}
