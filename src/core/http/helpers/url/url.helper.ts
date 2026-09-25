import type { tHttpQuery } from '../../type';

export function createHttpUrl(
  baseUrl: string,
  url: string,
  query?: tHttpQuery,
) {
  const requestUrl =
    buildRequestUrl(
      baseUrl,
      url,
    );

  const searchParams = new URLSearchParams();

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

  const queryString = searchParams.toString();

  if (!queryString) {
    return requestUrl;
  }

  return `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${queryString}`;
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
