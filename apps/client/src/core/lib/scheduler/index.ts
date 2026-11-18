import { moduleCreateAnimationFrame } from './modules/createAnimationFrame.modules';
import { moduleCreateTimeout } from './modules/createTimeout.modules';
import { moduleWaitForIdle } from './modules/waitForIdle.modules';

export const LibScheduler = {
  ...moduleCreateAnimationFrame,
  ...moduleCreateTimeout,
  ...moduleWaitForIdle,
};
