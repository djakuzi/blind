import { HttpError } from '../../HttpError';
import * as helpers from '../../helpers';
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
) {
  if (error instanceof HttpError) {
    return error;
  }

  if (helpers.isAbortError(error)) {
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
    message: 'HTTP network request failed',
    type: 'network',
    status: null,
    url,
    cause: error,
  });
}
