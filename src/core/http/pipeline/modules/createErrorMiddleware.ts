import { HttpError } from '../../httpError';
import type { tHttpErrorInterceptor, tHttpMiddleware } from '../../type';

export function createErrorMiddleware(
  interceptors: tHttpErrorInterceptor[],
): tHttpMiddleware {
  return async function errorMiddleware(
    context,
    next,
  ) {
    try {
      return await next();
    } catch (error) {
      const httpError =
        normalizeHttpError(
          error,
          context.request?.url ?? context.url,
          Boolean(context.abortState?.isTimeout()),
          Boolean(context.abortState?.signal.aborted),
        );

      for (const interceptor of interceptors) {
        await interceptor(httpError);
      }

      throw httpError;
    }
  };
}

function normalizeHttpError(
  error: unknown,
  url: string,
  isTimeout: boolean,
  isAborted: boolean,
) {
  if (error instanceof HttpError) {
    return error;
  }

  if (isTimeout || isAborted) {
    return new HttpError({
      message: isTimeout
        ? 'HTTP request timed out'
        : 'HTTP request was aborted',
      type: isTimeout
        ? 'timeout'
        : 'abort',
      status: null,
      url,
      cause: error,
    });
  }

  return new HttpError({
    message: 'HTTP internal request error',
    type: 'internal',
    status: null,
    url,
    cause: error,
  });
}
