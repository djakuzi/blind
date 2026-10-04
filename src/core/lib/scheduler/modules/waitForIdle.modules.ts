interface iWaitForIdleOptions {
  delay?: number;
  timeout?: number;
}

function waitForIdle(options: iWaitForIdleOptions = {}) {
  const delay = Math.max(0, options.delay ?? 0);
  const timeout = Math.max(0, options.timeout ?? 1000);

  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    function requestIdle() {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(
          () => {
            resolve();
          },
          {
            timeout,
          },
        );
        return;
      }

      setTimeout(resolve, 0);
    }

    if (delay > 0) {
      setTimeout(requestIdle, delay);
      return;
    }

    requestIdle();
  });
}

export const moduleWaitForIdle = {
  waitForIdle,
};
