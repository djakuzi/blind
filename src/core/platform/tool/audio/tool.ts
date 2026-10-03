import type {
  iAudioAdapter,
  iAudioLoopOptions,
  iAudioLoopVolumeOptions,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
} from './type';

interface iActiveLoop {
  audio: iAudioResource;
  options: iAudioLoopOptions;
}

function createHandledResult() {
  return {
    isHandled: true,
  };
}

export function createAudioTool(adapter: iAudioAdapter) {
  let muted = false;
  let completeSubscription:
    | Awaited<ReturnType<iAudioAdapter['subscribeComplete']>>
    | undefined;
  let completeSubscriptionRequest: Promise<void> | undefined;

  const activePlayCounts = new Map<string, number>();
  const activeLoops = new Map<string, iActiveLoop>();
  const runningLoopIds = new Set<string>();
  const preloadedAudioIds = new Set<string>();
  const preloadRequests = new Map<string, Promise<void>>();
  const loopRequests = new Map<string, Promise<void>>();

  function decrementActivePlay(assetId: string) {
    const count = activePlayCounts.get(assetId);

    if (!count) {
      return;
    }

    if (count <= 1) {
      activePlayCounts.delete(assetId);
      return;
    }

    activePlayCounts.set(assetId, count - 1);
  }

  async function ensureCompleteSubscription() {
    if (completeSubscription) {
      return;
    }

    if (completeSubscriptionRequest) {
      await completeSubscriptionRequest;
      return;
    }

    const request = (async () => {
      completeSubscription =
        await adapter.subscribeComplete(decrementActivePlay);
    })();

    completeSubscriptionRequest = request;

    try {
      await request;
    } finally {
      if (completeSubscriptionRequest === request) {
        completeSubscriptionRequest = undefined;
      }
    }
  }

  async function activate() {
    await ensureCompleteSubscription();

    return adapter.activate();
  }

  async function preloadResource(audio: iAudioPreloadResource) {
    if (preloadedAudioIds.has(audio.id)) {
      return;
    }

    const activeRequest = preloadRequests.get(audio.id);

    if (activeRequest) {
      await activeRequest;
      return;
    }

    const request = (async () => {
      await adapter.preloadResource(audio);
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

  async function preload(
    input: iAudioPreloadResource | readonly iAudioPreloadResource[],
  ) {
    const resources = Array.isArray(input) ? input : [input];

    await ensureCompleteSubscription();
    await Promise.all(resources.map((audio) => preloadResource(audio)));

    return createHandledResult();
  }

  async function play(
    audio: iAudioResource,
    options: iAudioPlayOptions = {},
  ) {
    if (muted) {
      return createHandledResult();
    }

    activePlayCounts.set(
      audio.id,
      (activePlayCounts.get(audio.id) ?? 0) + 1,
    );

    try {
      await adapter.playResource(audio, options);
    } catch (error) {
      decrementActivePlay(audio.id);
      throw error;
    }

    if (muted) {
      activePlayCounts.delete(audio.id);
      await adapter.stopResource(audio.id);
    }

    return createHandledResult();
  }

  async function startLoop(loopState: iActiveLoop) {
    const { audio, options } = loopState;

    if (muted || !activeLoops.has(audio.id) || runningLoopIds.has(audio.id)) {
      return;
    }

    const activeRequest = loopRequests.get(audio.id);

    if (activeRequest) {
      await activeRequest;
      return;
    }

    const request = (async () => {
      if (muted || !activeLoops.has(audio.id) || runningLoopIds.has(audio.id)) {
        return;
      }

      await adapter.startLoop(audio, options);

      if (muted || !activeLoops.has(audio.id)) {
        await adapter.stopResource(audio.id);
        return;
      }

      runningLoopIds.add(audio.id);
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

  async function loop(
    audio: iAudioResource,
    options: iAudioLoopOptions = {},
  ) {
    const loopState = {
      audio,
      options: {
        ...options,
      },
    };

    activeLoops.set(audio.id, loopState);

    if (runningLoopIds.has(audio.id)) {
      if (options.volume !== undefined) {
        await adapter.setLoopVolume(audio.id, {
          volume: options.volume,
        });
      }

      return createHandledResult();
    }

    await startLoop(loopState);

    return createHandledResult();
  }

  async function setLoopVolume(
    audio: iAudioResource,
    options: iAudioLoopVolumeOptions,
  ) {
    const loopState = activeLoops.get(audio.id);

    if (!loopState) {
      return createHandledResult();
    }

    loopState.options = {
      ...loopState.options,
      volume: options.volume,
    };

    const activeRequest = loopRequests.get(audio.id);

    if (activeRequest) {
      await activeRequest;
    }

    if (muted || !runningLoopIds.has(audio.id)) {
      return createHandledResult();
    }

    await adapter.setLoopVolume(audio.id, options);

    return createHandledResult();
  }

  async function stop(audio: iAudioResource) {
    activePlayCounts.delete(audio.id);
    activeLoops.delete(audio.id);

    const activeLoopRequest = loopRequests.get(audio.id);

    if (activeLoopRequest) {
      await activeLoopRequest;
    }

    runningLoopIds.delete(audio.id);
    await adapter.stopResource(audio.id);

    return createHandledResult();
  }

  async function setMuted(value: boolean) {
    if (muted === value) {
      return createHandledResult();
    }

    muted = value;

    if (muted) {
      await Promise.allSettled([...loopRequests.values()]);

      const audioIds = new Set([
        ...activePlayCounts.keys(),
        ...runningLoopIds,
      ]);

      await Promise.all(
        [...audioIds].map((assetId) => adapter.stopResource(assetId)),
      );

      activePlayCounts.clear();
      runningLoopIds.clear();

      return createHandledResult();
    }

    await Promise.all(
      [...activeLoops.values()].map((loopState) => startLoop(loopState)),
    );

    return createHandledResult();
  }

  async function destroy() {
    activeLoops.clear();

    await Promise.allSettled([
      ...preloadRequests.values(),
      ...loopRequests.values(),
      ...(completeSubscriptionRequest
        ? [completeSubscriptionRequest]
        : []),
    ]);

    const subscription = completeSubscription;

    completeSubscription = undefined;
    completeSubscriptionRequest = undefined;

    if (subscription) {
      await subscription.unsubscribe();
    }

    activePlayCounts.clear();
    runningLoopIds.clear();
    preloadedAudioIds.clear();
    preloadRequests.clear();
    loopRequests.clear();
    muted = false;

    await adapter.destroy();

    return createHandledResult();
  }

  return {
    activate,
    preload,
    play,
    loop,
    setLoopVolume,
    stop,
    setMuted,
    destroy,
  };
}
