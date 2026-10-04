import { HttpError } from '../../httpError';
import type { tHttpMiddleware } from '../../type';

export function createFetchMiddleware(): tHttpMiddleware {
  return async function fetchMiddleware(context, next) {
    if (!context.request) {
      throw new Error('Http request context is not prepared');
    }

    try {
      context.response = await fetch(context.request.url, context.request.init);
    } catch (error) {
      if (context.abortState?.signal.aborted) {
        throw error;
      }

      throw new HttpError({
        message: 'HTTP network request failed',
        type: 'network',
        status: null,
        url: context.request.url,
        cause: error,
      });
    }

    return await next();
  };
}
