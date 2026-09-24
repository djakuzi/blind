import type { iHttpAbortState } from '../../type';

export function createAbortState(
  signal: AbortSignal | undefined,
  timeout: number | undefined,
): iHttpAbortState {
  const controller =
    new AbortController();

  let isTimeout = false;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const handleAbort = () => {
    controller.abort(signal?.reason);
  };

  if (signal?.aborted) {
    handleAbort();
  } else {
    signal?.addEventListener(
      'abort',
      handleAbort,
      {
        once: true,
      },
    );
  }

  if (timeout !== undefined) {
    timeoutId =
      setTimeout(
        () => {
          isTimeout = true;
          controller.abort();
        },
        timeout,
      );
  }

  return {
    signal: controller.signal,
    isTimeout: () => isTimeout,
    cleanup: () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      signal?.removeEventListener(
        'abort',
        handleAbort,
      );
    },
  };
}

export function isAbortError(
  error: unknown,
) {
  return error instanceof DOMException
    && error.name === 'AbortError';
}
