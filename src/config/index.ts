import { createApiConfig } from './configs/api';
import { createAppConfig } from './configs/app';
import type { AppConfigShape } from './types';

export class Config implements AppConfigShape {
  readonly app;
  readonly api;

  constructor() {
    const resolvedMode = import.meta.env.APP_MODE === 'prod'
      ? 'prod'
      : 'dev';

    this.app = createAppConfig(resolvedMode);
    this.api = createApiConfig(resolvedMode);
  }
}

export const config = new Config();
