import { resolveAdapter } from '../../adapter';
import { PlatformRuntime } from '../../runtime';
import { DesktopAudioAdapter } from './adapters/desktop.adapter';
import { MobileAudioAdapter } from './adapters/mobile.adapter';
import { WebAudioAdapter } from './adapters/web.adapter';
import type {
  iAudioPlayOptions,
  iAudioPreloadResource,
  iAudioResource,
} from './type';

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

function isAudioResourceList(
  input: iAudioPreloadResource | readonly iAudioPreloadResource[],
): input is readonly iAudioPreloadResource[] {
  return Array.isArray(input);
}

export const {
  activate,
  loop,
  stop,
  setMuted,
  destroy,
} = AudioAdapter;

export function preload(
  input: iAudioPreloadResource | readonly iAudioPreloadResource[],
) {
  const resources = isAudioResourceList(input) ? input : [input];

  return AudioAdapter.preload(resources);
}

export function play(
  audio: iAudioResource,
  options: iAudioPlayOptions = {},
) {
  return AudioAdapter.play(audio, options);
}
