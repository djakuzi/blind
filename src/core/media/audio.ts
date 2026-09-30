import AudioAsset1 from '@/assets/audio/sfx/interaction/hold-complete.wav'

export const AUDIO_ASSETS = {
  'sfx.interaction.hold-complete': {
    id: 'sfx.interaction.hold-complete',
    src: AudioAsset1,
    type: 'sfx',
  },
} as const

export const AUDIO_GROUPS = {
  'sfx': [
    AUDIO_ASSETS['sfx.interaction.hold-complete'],
  ],
  'sfx.interaction': [
    AUDIO_ASSETS['sfx.interaction.hold-complete'],
  ],
} as const

export type tAudioId = keyof typeof AUDIO_ASSETS
export type tAudioGroupId = keyof typeof AUDIO_GROUPS
export type tAudioType = 'sfx' | 'music'
