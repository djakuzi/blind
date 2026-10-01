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
    'sfx.interaction.hold-complete',
  ],
  'sfx.interaction': [
    'sfx.interaction.hold-complete',
  ],
} as const
