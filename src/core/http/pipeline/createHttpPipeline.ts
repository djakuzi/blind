import type { iHttpPipelineContext, tHttpMiddleware } from '../type';

export function createHttpPipeline(middlewares: tHttpMiddleware[]) {
  return async function runHttpPipeline(context: iHttpPipelineContext) {
    let index = -1;

    async function dispatch(currentIndex: number): Promise<iHttpPipelineContext> {
      if (currentIndex <= index) {
        throw new Error('Http middleware next() was called multiple times');
      }

      index = currentIndex;

      const middleware = middlewares[currentIndex];

      if (!middleware) {
        return context;
      }

      return await middleware(context, () => dispatch(currentIndex + 1));
    }

    return await dispatch(0);
  };
}
