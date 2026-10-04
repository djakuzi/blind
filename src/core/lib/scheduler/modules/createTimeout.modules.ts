function createTimeout() {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function cancel() {
    if (timeoutId === undefined) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = undefined;
  }

  function start(callback: () => void, delay = 0) {
    cancel();

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      callback();
    }, delay);
  }

  function isActive() {
    return timeoutId !== undefined;
  }

  return {
    cancel,
    isActive,
    start,
  };
}

export const moduleCreateTimeout = {
  createTimeout,
};
