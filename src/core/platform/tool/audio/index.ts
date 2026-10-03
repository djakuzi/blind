import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopAudioAdapter } from './adapters/desktop.adapter';
import { MobileAudioAdapter } from './adapters/mobile.adapter';
import { WebAudioAdapter } from './adapters/web.adapter';
import { createAudioService } from './service';

export type {
  iAudioAdapter,
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
} from './type';

const AudioAdapter = resolveAdapter(
  {
    web: WebAudioAdapter,
    mobile: MobileAudioAdapter,
    desktop: DesktopAudioAdapter,
  },
  PlatformRuntime.getRuntime(),
);

export const {
  activate,
  preload,
  play,
  loop,
  stop,
  setMuted,
  destroy,
} = createAudioService(AudioAdapter);
