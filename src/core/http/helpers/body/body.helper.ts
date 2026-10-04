export function prepareRequestBody<TBody>(body: TBody | undefined, headers: Headers) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isNativeFetchBody(body)) {
    return body;
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return JSON.stringify(body);
}

function isNativeFetchBody(value: unknown): value is BodyInit {
  return (
    typeof value === 'string' ||
    value instanceof FormData ||
    value instanceof Blob ||
    value instanceof ArrayBuffer ||
    value instanceof URLSearchParams ||
    ArrayBuffer.isView(value)
  );
}
