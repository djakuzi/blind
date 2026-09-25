import * as helpers from '../../helpers';
import type { tHttpMiddleware } from '../../type';

export function createAbortMiddleware(): tHttpMiddleware {
  return async function abortMiddleware(context, next) {
    const timeout = context.requestConfig.timeout ?? context.clientConfig.timeout;

    const abortState = helpers.createAbortState(context.requestConfig.signal, timeout);

    context.abortState = abortState;

    if (context.request) {
      context.request = {
        ...context.request,
        init: {
          ...context.request.init,
          signal: abortState.signal,
        },
      };
    }

    try {
      return await next();
    } finally {
      abortState.cleanup();
    }
  };
}
