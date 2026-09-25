import { HttpError } from '../../httpError';
import type { tHttpResponseType } from '../../type';

export async function parseResponseData(response: Response, responseType: tHttpResponseType, url: string) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  if (responseType === 'blob') {
    return await response.blob();
  }

  if (responseType === 'text') {
    return await response.text();
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch (error) {
    throw new HttpError({
      message: 'Failed to parse HTTP response',
      type: 'parse',
      status: response.status,
      url,
      data: text,
      cause: error,
    });
  }
}

export async function parseErrorData(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
