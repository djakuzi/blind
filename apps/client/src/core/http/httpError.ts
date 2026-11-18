import type { tHttpErrorType } from './type';

export interface iPayloadHttpError {
  message: string;
  type: tHttpErrorType;
  status: number | null;
  url: string;
  data?: unknown;
  cause?: unknown;
}

export class HttpError extends Error {
  readonly type: tHttpErrorType;
  readonly status: number | null;
  readonly url: string;
  readonly data: unknown;

  constructor(payload: iPayloadHttpError) {
    super(payload.message, {
      cause: payload.cause,
    });

    this.name = 'HttpError';
    this.type = payload.type;
    this.status = payload.status;
    this.url = payload.url;
    this.data = payload.data;
  }
}
