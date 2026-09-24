import { ApiError } from './ApiError';
import * as helpers from './helpers';
import type { iApiClientConfig, iApiRequestConfig, iApiRequestContext, iApiResponseContext, tApiErrorInterceptor, tApiMethod, tApiRequestInterceptor, tApiResponseInterceptor } from './api.type';

export class ApiClient {
  private readonly baseUrl: string;
  private readonly headers?: HeadersInit;
  private readonly timeout?: number;
  private readonly requestInterceptors: tApiRequestInterceptor[] = [];
  private readonly responseInterceptors: tApiResponseInterceptor[] = [];
  private readonly errorInterceptors: tApiErrorInterceptor[] = [];

  constructor(
    config: iApiClientConfig = {},
  ) {
    this.baseUrl = config.baseUrl ?? '';
    this.headers = config.headers;
    this.timeout = config.timeout;
  }

  useRequestInterceptor(
    interceptor: tApiRequestInterceptor,
  ) {
    this.requestInterceptors.push(interceptor);
  }

  useResponseInterceptor(
    interceptor: tApiResponseInterceptor,
  ) {
    this.responseInterceptors.push(interceptor);
  }

  useErrorInterceptor(
    interceptor: tApiErrorInterceptor,
  ) {
    this.errorInterceptors.push(interceptor);
  }

  async request<TResponse, TBody = unknown>(
    method: tApiMethod,
    url: string,
    config: iApiRequestConfig<TBody> = {},
  ): Promise<TResponse> {
    const responseType =
      config.responseType ?? 'json';

    const headers =
      helpers.mergeHeaders(
        this.headers,
        config.headers,
      );

    const body =
      helpers.prepareRequestBody(
        config.body,
        headers,
      );

    const timeout =
      config.timeout ?? this.timeout;

    const abortState =
      this.createAbortState(
        config.signal,
        timeout,
      );

    let request: iApiRequestContext = {
      url: helpers.createApiUrl(
        this.baseUrl,
        url,
        config.query,
      ),
      init: {
        method,
        headers,
        body,
        signal: abortState.signal,
      },
      method,
      responseType,
    };

    try {
      request =
        await this.applyRequestInterceptors(request);

      let response =
        await fetch(
          request.url,
          request.init,
        );

      const responseContext =
        await this.applyResponseInterceptors({
          request,
          response,
        });

      response =
        responseContext.response;

      if (!response.ok) {
        throw new ApiError({
          message: `API request failed with status ${response.status}`,
          type: 'http',
          status: response.status,
          url: request.url,
          data: await helpers.parseErrorData(response),
        });
      }

      return await helpers.parseResponseData(
        response,
        responseType,
        request.url,
      ) as TResponse;
    } catch (error) {
      const apiError =
        this.normalizeError(
          error,
          request.url,
          abortState.isTimeout(),
        );

      await this.applyErrorInterceptors(apiError);

      throw apiError;
    } finally {
      abortState.cleanup();
    }
  }

  async get<TResponse>(
    url: string,
    config?: iApiRequestConfig,
  ) {
    return await this.request<TResponse>(
      'GET',
      url,
      config,
    );
  }

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config: iApiRequestConfig<TBody> = {},
  ) {
    return await this.request<TResponse, TBody>(
      'POST',
      url,
      {
        ...config,
        body,
      },
    );
  }

  async put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config: iApiRequestConfig<TBody> = {},
  ) {
    return await this.request<TResponse, TBody>(
      'PUT',
      url,
      {
        ...config,
        body,
      },
    );
  }

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config: iApiRequestConfig<TBody> = {},
  ) {
    return await this.request<TResponse, TBody>(
      'PATCH',
      url,
      {
        ...config,
        body,
      },
    );
  }

  async delete<TResponse>(
    url: string,
    config?: iApiRequestConfig,
  ) {
    return await this.request<TResponse>(
      'DELETE',
      url,
      config,
    );
  }

  private async applyRequestInterceptors(
    context: iApiRequestContext,
  ) {
    let currentContext =
      context;

    for (const interceptor of this.requestInterceptors) {
      currentContext =
        await interceptor(currentContext);
    }

    return currentContext;
  }

  private async applyResponseInterceptors(
    context: iApiResponseContext,
  ) {
    let currentContext =
      context;

    for (const interceptor of this.responseInterceptors) {
      currentContext =
        await interceptor(currentContext);
    }

    return currentContext;
  }

  private async applyErrorInterceptors(
    error: ApiError,
  ) {
    for (const interceptor of this.errorInterceptors) {
      await interceptor(error);
    }
  }

  private createAbortState(
    signal: AbortSignal | undefined,
    timeout: number | undefined,
  ) {
    const controller =
      new AbortController();

    let isTimeout =
      false;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleAbort = () => {
      controller.abort(signal?.reason);
    };

    if (signal?.aborted) {
      handleAbort();
    } else {
      signal?.addEventListener(
        'abort',
        handleAbort,
        {
          once: true,
        },
      );
    }

    if (timeout !== undefined) {
      timeoutId =
        setTimeout(
          () => {
            isTimeout = true;
            controller.abort();
          },
          timeout,
        );
    }

    return {
      signal: controller.signal,
      isTimeout: () => isTimeout,
      cleanup: () => {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }

        signal?.removeEventListener(
          'abort',
          handleAbort,
        );
      },
    };
  }

  private normalizeError(
    error: unknown,
    url: string,
    isTimeout: boolean,
  ) {
    if (error instanceof ApiError) {
      return error;
    }

    if (helpers.isAbortError(error)) {
      return new ApiError({
        message: isTimeout
          ? 'API request timed out'
          : 'API request was aborted',
        type: isTimeout
          ? 'timeout'
          : 'abort',
        status: null,
        url,
        cause: error,
      });
    }

    return new ApiError({
      message: 'API network request failed',
      type: 'network',
      status: null,
      url,
      cause: error,
    });
  }
}
