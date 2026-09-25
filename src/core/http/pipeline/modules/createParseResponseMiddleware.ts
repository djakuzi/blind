import { HttpError } from '../../httpError';
import * as helpers from '../../helpers';
import type { tHttpMiddleware } from '../../type';

export function createParseResponseMiddleware(): tHttpMiddleware {
  return async function parseResponseMiddleware(context, next) {
    if (!context.request || !context.response) {
      return await next();
    }

    if (!context.response.ok) {
      throw new HttpError({
        message: `HTTP request failed with status ${context.response.status}`,
        type: 'http',
        status: context.response.status,
        url: context.request.url,
        data: await helpers.parseErrorData(context.response),
      });
    }

    context.data = await helpers.parseResponseData(context.response, context.responseType, context.request.url);

    return await next();
  };
}
