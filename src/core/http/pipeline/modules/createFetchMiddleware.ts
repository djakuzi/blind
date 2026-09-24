import type { tHttpMiddleware } from '../../type';

export function createFetchMiddleware(): tHttpMiddleware {
  return async function fetchMiddleware(
    context,
    next,
  ) {
    if (!context.request) {
      throw new Error('Http request context is not prepared');
    }

    context.response =
      await fetch(
        context.request.url,
        context.request.init,
      );

    return await next();
  };
}
