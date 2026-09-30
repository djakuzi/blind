import AudioAsset1 from '@/assets/audio/sfx/interaction/hold-complete.wav'

const AUDIO_ASSETS = {
  'sfx.interaction.hold-complete': {
    id: 'sfx.interaction.hold-complete',
    src: AudioAsset1,
    type: 'sfx',
  },
} as const

const AUDIO_GROUPS = {
  'sfx': [
    'sfx.interaction.hold-complete',
  ],
  'sfx.interaction': [
    'sfx.interaction.hold-complete',
  ],
} as const

export type tAudioId = keyof typeof AUDIO_ASSETS
export type tAudioGroupId = keyof typeof AUDIO_GROUPS
export type tAudioType = 'sfx' | 'music'

export const MediaAudio = {
  getAudio(id: tAudioId) {
    return AUDIO_ASSETS[id]
  },

  getAudioGroup(id: tAudioGroupId) {
    return AUDIO_GROUPS[id].map((audioId) => AUDIO_ASSETS[audioId])
  },
} as const
