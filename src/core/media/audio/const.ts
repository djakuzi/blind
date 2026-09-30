import AudioAsset1 from '@/assets/audio/sfx/interaction/hold-complete-v2.wav'
import AudioAsset2 from '@/assets/audio/sfx/interaction/hold-complete.wav'

export const AUDIO_ASSETS = {
  'sfx.interaction.hold-complete-v2': {
    id: 'sfx.interaction.hold-complete-v2',
    src: AudioAsset1,
    type: 'sfx',
  },
  'sfx.interaction.hold-complete': {
    id: 'sfx.interaction.hold-complete',
    src: AudioAsset2,
    type: 'sfx',
  },
} as const

export const AUDIO_GROUPS = {
  'sfx': [
    'sfx.interaction.hold-complete-v2',
    'sfx.interaction.hold-complete',
  ],
  'sfx.interaction': [
    'sfx.interaction.hold-complete-v2',
    'sfx.interaction.hold-complete',
  ],
} as const
