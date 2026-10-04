import { moduleCreateAnimationFrame } from './modules/createAnimationFrame.modules';
import { moduleCreateTimeout } from './modules/createTimeout.modules';

export const LibScheduler = {
  ...moduleCreateAnimationFrame,
  ...moduleCreateTimeout,
};
