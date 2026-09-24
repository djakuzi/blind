import type { tHttpMiddleware, tHttpResponseInterceptor } from '../../type';

export function createResponseInterceptorsMiddleware(
  interceptors: tHttpResponseInterceptor[],
): tHttpMiddleware {
  return async function responseInterceptorsMiddleware(
    context,
    next,
  ) {
    if (!context.request || !context.response) {
      return await next();
    }

    let responseContext = {
      request: context.request,
      response: context.response,
    };

    for (const interceptor of interceptors) {
      responseContext =
        await interceptor(responseContext);
    }

    context.request =
      responseContext.request;
    context.response =
      responseContext.response;

    return await next();
  };
}
