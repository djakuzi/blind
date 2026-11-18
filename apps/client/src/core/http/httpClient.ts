import { createHttpPipeline } from './pipeline/createHttpPipeline';
import { createAbortMiddleware } from './pipeline/modules/createAbortMiddleware';
import { createErrorMiddleware } from './pipeline/modules/createErrorMiddleware';
import { createFetchMiddleware } from './pipeline/modules/createFetchMiddleware';
import { createParseResponseMiddleware } from './pipeline/modules/createParseResponseMiddleware';
import { createPrepareRequestMiddleware } from './pipeline/modules/createPrepareRequestMiddleware';
import { createRequestInterceptorsMiddleware } from './pipeline/modules/createRequestInterceptorsMiddleware';
import { createResponseInterceptorsMiddleware } from './pipeline/modules/createResponseInterceptorsMiddleware';
import type {
  iHttpClientConfig,
  iHttpPipelineContext,
  iHttpRequestConfig,
  tHttpErrorInterceptor,
  tHttpMethod,
  tHttpMiddleware,
  tHttpRemoveInterceptor,
  tHttpRequestInterceptor,
  tHttpResponseInterceptor,
} from './type';

export class HttpClient {
  private readonly baseUrl: string;
  private readonly headers?: HeadersInit;
  private readonly timeout?: number;
  private readonly requestInterceptors: tHttpRequestInterceptor[] = [];
  private readonly responseInterceptors: tHttpResponseInterceptor[] = [];
  private readonly errorInterceptors: tHttpErrorInterceptor[] = [];
  private readonly runPipeline: (context: iHttpPipelineContext) => Promise<iHttpPipelineContext>;

  constructor(config: iHttpClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? '';
    this.headers = config.headers;
    this.timeout = config.timeout;
    this.runPipeline = createHttpPipeline(this.createPipeline());
  }

  useRequestInterceptor(interceptor: tHttpRequestInterceptor): tHttpRemoveInterceptor {
    this.requestInterceptors.push(interceptor);

    return () => {
      this.removeInterceptor(this.requestInterceptors, interceptor);
    };
  }

  useResponseInterceptor(interceptor: tHttpResponseInterceptor): tHttpRemoveInterceptor {
    this.responseInterceptors.push(interceptor);

    return () => {
      this.removeInterceptor(this.responseInterceptors, interceptor);
    };
  }

  useErrorInterceptor(interceptor: tHttpErrorInterceptor): tHttpRemoveInterceptor {
    this.errorInterceptors.push(interceptor);

    return () => {
      this.removeInterceptor(this.errorInterceptors, interceptor);
    };
  }

  async request<TResponse, TBody = unknown>(method: tHttpMethod, url: string, config: iHttpRequestConfig<TBody> = {}): Promise<TResponse> {
    const context: iHttpPipelineContext<TBody> = {
      clientConfig: {
        baseUrl: this.baseUrl,
        headers: this.headers,
        timeout: this.timeout,
      },
      requestConfig: config,
      method,
      url,
      responseType: config.responseType ?? 'json',
      request: null,
      response: null,
      data: null,
      abortState: null,
    };

    const result = await this.runPipeline(context);

    return result.data as TResponse;
  }

  async get<TResponse>(url: string, config?: iHttpRequestConfig) {
    return await this.request<TResponse>('GET', url, config);
  }

  async post<TResponse, TBody = unknown>(url: string, body?: TBody, config: iHttpRequestConfig<TBody> = {}) {
    return await this.request<TResponse, TBody>('POST', url, {
      ...config,
      body,
    });
  }

  async put<TResponse, TBody = unknown>(url: string, body?: TBody, config: iHttpRequestConfig<TBody> = {}) {
    return await this.request<TResponse, TBody>('PUT', url, {
      ...config,
      body,
    });
  }

  async patch<TResponse, TBody = unknown>(url: string, body?: TBody, config: iHttpRequestConfig<TBody> = {}) {
    return await this.request<TResponse, TBody>('PATCH', url, {
      ...config,
      body,
    });
  }

  async delete<TResponse>(url: string, config?: iHttpRequestConfig) {
    return await this.request<TResponse>('DELETE', url, config);
  }

  private createPipeline(): tHttpMiddleware[] {
    return [
      createErrorMiddleware(this.errorInterceptors),
      createPrepareRequestMiddleware(),
      createRequestInterceptorsMiddleware(this.requestInterceptors),
      createAbortMiddleware(),
      createFetchMiddleware(),
      createResponseInterceptorsMiddleware(this.responseInterceptors),
      createParseResponseMiddleware(),
    ];
  }

  private removeInterceptor<TInterceptor>(interceptors: TInterceptor[], interceptor: TInterceptor) {
    const index = interceptors.indexOf(interceptor);

    if (index === -1) {
      return;
    }

    interceptors.splice(index, 1);
  }
}
