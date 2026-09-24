import { ApiError } from './ApiError';
import type { tApiQuery, tApiResponseType } from './api.type';

export function createApiUrl(
  baseUrl: string,
  url: string,
  query?: tApiQuery,
) {
  const requestUrl =
    buildRequestUrl(
      baseUrl,
      url,
    );

  const searchParams =
    new URLSearchParams();

  Object.entries(query ?? {}).forEach(([
    key,
    value,
  ]) => {
    if (value === null || value === undefined) {
      return;
    }

    searchParams.set(
      key,
      String(value),
    );
  });

  const queryString =
    searchParams.toString();

  if (!queryString) {
    return requestUrl;
  }

  return `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${queryString}`;
}

export function mergeHeaders(
  defaultHeaders?: HeadersInit,
  requestHeaders?: HeadersInit,
) {
  const headers =
    new Headers(defaultHeaders);

  new Headers(requestHeaders).forEach((
    value,
    key,
  ) => {
    headers.set(
      key,
      value,
    );
  });

  return headers;
}

export function prepareRequestBody<TBody>(
  body: TBody | undefined,
  headers: Headers,
) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isNativeFetchBody(body)) {
    return body;
  }

  if (!headers.has('Content-Type')) {
    headers.set(
      'Content-Type',
      'application/json',
    );
  }

  return JSON.stringify(body);
}

export async function parseResponseData(
  response: Response,
  responseType: tApiResponseType,
  url: string,
) {
  if (
    response.status === 204
    || response.status === 205
  ) {
    return null;
  }

  if (responseType === 'blob') {
    return await response.blob();
  }

  if (responseType === 'text') {
    return await response.text();
  }

  const text =
    await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new ApiError({
      message: 'Failed to parse API response',
      type: 'parse',
      status: response.status,
      url,
      data: text,
      cause: error,
    });
  }
}

export async function parseErrorData(
  response: Response,
) {
  const text =
    await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export function isAbortError(
  error: unknown,
) {
  return error instanceof DOMException
    && error.name === 'AbortError';
}

function buildRequestUrl(
  baseUrl: string,
  url: string,
) {
  if (isAbsoluteUrl(url) || !baseUrl) {
    return url;
  }

  return [
    baseUrl.replace(/\/+$/u, ''),
    url.replace(/^\/+/u, ''),
  ].join('/');
}

function isAbsoluteUrl(
  url: string,
) {
  return /^[a-z][a-z\d+\-.]*:/iu.test(url);
}

function isNativeFetchBody(
  value: unknown,
): value is BodyInit {
  return typeof value === 'string'
    || value instanceof FormData
    || value instanceof Blob
    || value instanceof ArrayBuffer
    || value instanceof URLSearchParams
    || ArrayBuffer.isView(value);
}
