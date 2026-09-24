import * as helpers from '../../helpers';
import type { tHttpMiddleware } from '../../type';

export function createPrepareRequestMiddleware(): tHttpMiddleware {
  return async function prepareRequestMiddleware(
    context,
    next,
  ) {
    const headers =
      helpers.mergeHeaders(
        context.clientConfig.headers,
        context.requestConfig.headers,
      );

    const body =
      helpers.prepareRequestBody(
        context.requestConfig.body,
        headers,
      );

    context.request = {
      url: helpers.createHttpUrl(
        context.clientConfig.baseUrl,
        context.url,
        context.requestConfig.query,
      ),
      init: {
        method: context.method,
        headers,
        body,
      },
      method: context.method,
      responseType: context.responseType,
    };

    return await next();
  };
}
