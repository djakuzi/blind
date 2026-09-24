export type tHttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export type tHttpResponseType =
  | 'json'
  | 'text'
  | 'blob';

export type tHttpErrorType =
  | 'network'
  | 'timeout'
  | 'http'
  | 'parse'
  | 'abort'
  | 'internal';

export type tHttpQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type tHttpQuery =
  Record<string, tHttpQueryValue>;

export interface iHttpClientConfig {
  baseUrl?: string
  headers?: HeadersInit
  timeout?: number
}

export interface iHttpRequestConfig<TBody = unknown> {
  headers?: HeadersInit
  query?: tHttpQuery
  body?: TBody
  signal?: AbortSignal
  timeout?: number
  responseType?: tHttpResponseType
}

export interface iHttpRequestContext {
  url: string
  init: RequestInit
  method: tHttpMethod
}

export interface iHttpResponseContext {
  request: iHttpRequestContext
  response: Response
}

export type tHttpRequestInterceptor =
  (
    context: iHttpRequestContext,
  ) => iHttpRequestContext | Promise<iHttpRequestContext>;

export type tHttpResponseInterceptor =
  (
    context: iHttpResponseContext,
  ) => iHttpResponseContext | Promise<iHttpResponseContext>;

export type tHttpErrorInterceptor =
  (error: import('./httpError').HttpError) => void | Promise<void>;

export type tHttpRemoveInterceptor =
  () => void;

export interface iHttpAbortState {
  signal: AbortSignal
  isTimeout: () => boolean
  cleanup: () => void
}

export interface iHttpPipelineContext<TBody = unknown> {
  clientConfig: Required<Pick<iHttpClientConfig, 'baseUrl'>> & Omit<iHttpClientConfig, 'baseUrl'>
  requestConfig: iHttpRequestConfig<TBody>
  method: tHttpMethod
  url: string
  responseType: tHttpResponseType
  request: iHttpRequestContext | null
  response: Response | null
  data: unknown
  abortState: iHttpAbortState | null
}

export type tHttpMiddleware =
  (
    context: iHttpPipelineContext,
    next: () => Promise<iHttpPipelineContext>,
  ) => Promise<iHttpPipelineContext>;
