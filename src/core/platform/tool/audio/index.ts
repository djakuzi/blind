import { resolveRuntimeAdapter } from '../../adapter';
import { DesktopAudioAdapter } from './adapters/desktop.adapter';
import { MobileAudioAdapter } from './adapters/mobile.adapter';
import { WebAudioAdapter } from './adapters/web.adapter';
import { createAudioTool } from './tool';

export type {
  iAudioAdapter,
  iAudioLoopOptions,
  iAudioLoopVolumeOptions,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
} from './type';

const AudioAdapter = resolveRuntimeAdapter({
  web: WebAudioAdapter,
  mobile: MobileAudioAdapter,
  desktop: DesktopAudioAdapter,
});

export const {
  activate,
  preload,
  play,
  loop,
  setLoopVolume,
  stop,
  setMuted,
  destroy,
} = createAudioTool(AudioAdapter);
