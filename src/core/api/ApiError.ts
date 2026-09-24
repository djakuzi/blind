import type { tApiErrorType } from './api.type';

export interface iPayloadApiError {
  message: string
  type: tApiErrorType
  status: number | null
  url: string
  data?: unknown
  cause?: unknown
}

export class ApiError extends Error {
  readonly type: tApiErrorType;
  readonly status: number | null;
  readonly url: string;
  readonly data: unknown;

  constructor(
    payload: iPayloadApiError,
  ) {
    super(
      payload.message,
      {
        cause: payload.cause,
      },
    );

    this.name = 'ApiError';
    this.type = payload.type;
    this.status = payload.status;
    this.url = payload.url;
    this.data = payload.data;
  }
}
