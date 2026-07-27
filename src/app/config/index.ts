import { createLogConfig } from './configs/logs'
import type { IConfigAppShape, TAppMode } from './types'

const resolveMode = (mode: string): TAppMode => {
  return mode === 'prod' ? 'prod' : 'dev'
}

export class Config implements IConfigAppShape {
  readonly mode: TAppMode
  readonly log: boolean

  constructor(mode: string) {
    this.mode = resolveMode(mode);
    this.log = createLogConfig();
  }
}

export const config = new Config(import.meta.env.APP_MODE ?? 'dev')
