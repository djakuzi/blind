export function mergeHeaders(
  defaultHeaders?: HeadersInit,
  requestHeaders?: HeadersInit,
) {
  const headers = new Headers(defaultHeaders);

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
