import AudioAsset1 from '@/assets/audio/sfx/interaction/hold-complete.wav'
import AudioAsset2 from '@/assets/audio/sfx/interaction/hold-start.wav'

export const AUDIO_ASSETS = {
  'sfx.interaction.hold-complete': {
    id: 'sfx.interaction.hold-complete',
    src: AudioAsset1,
    type: 'sfx',
  },
  'sfx.interaction.hold-start': {
    id: 'sfx.interaction.hold-start',
    src: AudioAsset2,
    type: 'sfx',
  },
} as const

export const AUDIO_GROUPS = {
  'sfx': [
    'sfx.interaction.hold-complete',
    'sfx.interaction.hold-start',
  ],
  'sfx.interaction': [
    'sfx.interaction.hold-complete',
    'sfx.interaction.hold-start',
  ],
} as const
