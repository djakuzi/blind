import type { AUDIO_ASSETS, AUDIO_GROUPS } from './const';

export type tAudioId = keyof typeof AUDIO_ASSETS;
export type tAudioGroupId = keyof typeof AUDIO_GROUPS;
export type tAudioType = 'sfx' | 'music';
