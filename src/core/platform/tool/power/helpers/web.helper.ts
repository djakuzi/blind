let sentinel: WakeLockSentinel | undefined;
let acquireRequest: Promise<boolean> | undefined;
let shouldKeepAwake = false;
let isVisibilitySubscribed = false;

function getWakeLock(): WakeLock | undefined {
  if (
    typeof navigator === 'undefined' ||
    !('wakeLock' in navigator)
  ) {
    return undefined;
  }

  return navigator.wakeLock;
}

async function acquire() {
  const wakeLock = getWakeLock();

  if (
    !wakeLock ||
    typeof document === 'undefined' ||
    document.visibilityState !== 'visible'
  ) {
    return false;
  }

  if (sentinel && !sentinel.released) {
    return true;
  }

  if (acquireRequest) {
    return acquireRequest;
  }

  const request = wakeLock
    .request('screen')
    .then((nextSentinel) => {
      sentinel = nextSentinel;

      nextSentinel.addEventListener(
        'release',
        () => {
          if (sentinel === nextSentinel) {
            sentinel = undefined;
          }
        },
        { once: true },
      );

      return true;
    })
    .catch(() => false);

  acquireRequest = request;

  try {
    return await request;
  } finally {
    if (acquireRequest === request) {
      acquireRequest = undefined;
    }
  }
}

function handleVisibilityChange() {
  if (
    !shouldKeepAwake ||
    typeof document === 'undefined' ||
    document.visibilityState !== 'visible'
  ) {
    return;
  }

  acquire().catch(() => undefined);
}

function subscribeVisibility() {
  if (isVisibilitySubscribed || typeof document === 'undefined') {
    return;
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);
  isVisibilitySubscribed = true;
}

function unsubscribeVisibility() {
  if (!isVisibilitySubscribed || typeof document === 'undefined') {
    return;
  }

  document.removeEventListener('visibilitychange', handleVisibilityChange);
  isVisibilitySubscribed = false;
}

async function keepAwake() {
  shouldKeepAwake = true;
  subscribeVisibility();

  return acquire();
}

async function allowSleep() {
  shouldKeepAwake = false;
  unsubscribeVisibility();

  if (acquireRequest) {
    await acquireRequest;
  }

  const activeSentinel = sentinel;

  if (!activeSentinel || activeSentinel.released) {
    sentinel = undefined;
    return getWakeLock() !== undefined;
  }

  try {
    await activeSentinel.release();
    sentinel = undefined;

    return true;
  } catch {
    return false;
  }
}

export const HelperWebPower = {
  keepAwake,
  allowSleep,
};
