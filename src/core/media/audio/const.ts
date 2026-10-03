import AudioAsset1 from '@/assets/audio/sfx/interaction/hold-complete.wav?no-inline'
import AudioAsset2 from '@/assets/audio/sfx/interaction/hold-progress.wav?no-inline'
import AudioAsset3 from '@/assets/audio/sfx/interaction/hold-start.wav?no-inline'

export const AUDIO_ASSETS = {
  'sfx.interaction.hold-complete': {
    id: 'sfx.interaction.hold-complete',
    src: AudioAsset1,
    type: 'sfx',
    channels: 4,
  },
  'sfx.interaction.hold-progress': {
    id: 'sfx.interaction.hold-progress',
    src: AudioAsset2,
    type: 'sfx',
    channels: 4,
  },
  'sfx.interaction.hold-start': {
    id: 'sfx.interaction.hold-start',
    src: AudioAsset3,
    type: 'sfx',
    channels: 4,
  },
} as const

export const AUDIO_GROUPS = {
  'sfx': [
    'sfx.interaction.hold-complete',
    'sfx.interaction.hold-progress',
    'sfx.interaction.hold-start',
  ],
  'sfx.interaction': [
    'sfx.interaction.hold-complete',
    'sfx.interaction.hold-progress',
    'sfx.interaction.hold-start',
  ],
} as const
