export type tApiMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE';

export type tApiResponseType =
  | 'json'
  | 'text'
  | 'blob';

export type tApiErrorType =
  | 'network'
  | 'timeout'
  | 'http'
  | 'parse'
  | 'abort';

export type tApiQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type tApiQuery =
  Record<string, tApiQueryValue>;

export interface iApiClientConfig {
  baseUrl?: string
  headers?: HeadersInit
  timeout?: number
}

export interface iApiRequestConfig<TBody = unknown> {
  headers?: HeadersInit
  query?: tApiQuery
  body?: TBody
  signal?: AbortSignal
  timeout?: number
  responseType?: tApiResponseType
}

export interface iApiRequestContext {
  url: string
  init: RequestInit
  method: tApiMethod
  responseType: tApiResponseType
}

export interface iApiResponseContext {
  request: iApiRequestContext
  response: Response
}

export type tApiRequestInterceptor =
  (
    context: iApiRequestContext,
  ) => iApiRequestContext | Promise<iApiRequestContext>;

export type tApiResponseInterceptor =
  (
    context: iApiResponseContext,
  ) => iApiResponseContext | Promise<iApiResponseContext>;

export type tApiErrorInterceptor =
  (error: import('./ApiError').ApiError) => void | Promise<void>;
