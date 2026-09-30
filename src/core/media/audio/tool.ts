import { AUDIO_ASSETS, AUDIO_GROUPS } from './const';
import type { tAudioGroupId, tAudioId } from './type';

export function getAudio(id: tAudioId) {
  return AUDIO_ASSETS[id];
}

export function getAudioGroup(id: tAudioGroupId) {
  return AUDIO_GROUPS[id].map((audioId) => AUDIO_ASSETS[audioId]);
}
