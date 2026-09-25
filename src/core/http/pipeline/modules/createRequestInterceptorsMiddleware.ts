import type { tHttpMiddleware, tHttpRequestInterceptor } from '../../type';

export function createRequestInterceptorsMiddleware(
  interceptors: tHttpRequestInterceptor[],
): tHttpMiddleware {
  return async function requestInterceptorsMiddleware(
    context,
    next,
  ) {
    if (!context.request) {
      return await next();
    }

    for (const interceptor of interceptors) {
      context.request = await interceptor(context.request);
    }

    return await next();
  };
}
