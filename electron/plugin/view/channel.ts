import { createElectronChannel } from '../../config';

export const VIEW_CHANNEL = {
  isFullscreen: createElectronChannel('view', 'is-fullscreen'),
  enterFullscreen: createElectronChannel('view', 'enter-fullscreen'),
  exitFullscreen: createElectronChannel('view', 'exit-fullscreen'),
} as const;
