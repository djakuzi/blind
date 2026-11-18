import type { iPlatformActionResult } from '../../type';

export interface iPowerAdapter {
  keepAwake(): Promise<iPlatformActionResult>;
  allowSleep(): Promise<iPlatformActionResult>;
}
