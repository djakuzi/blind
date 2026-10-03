import AudioAsset1 from '@/assets/audio/sfx/interaction/hold-complete.wav?no-inline'
import AudioAsset2 from '@/assets/audio/sfx/interaction/hold-progress.wav?no-inline'
import AudioAsset3 from '@/assets/audio/sfx/interaction/hold-start.wav?no-inline'
import AudioAsset4 from '@/assets/audio/sfx/navigation/back.wav?no-inline'
import AudioAsset5 from '@/assets/audio/sfx/selection/default.wav?no-inline'
import AudioAsset6 from '@/assets/audio/sfx/selection/slider.wav?no-inline'

export const AUDIO_ASSETS = {
  'sfx.interaction.hold-complete': {
    id: 'sfx.interaction.hold-complete',
    src: AudioAsset1,
    type: 'sfx',
    channels: 4,
    volume: 0.7,
  },
  'sfx.interaction.hold-progress': {
    id: 'sfx.interaction.hold-progress',
    src: AudioAsset2,
    type: 'sfx',
    channels: 4,
    volume: 1,
  },
  'sfx.interaction.hold-start': {
    id: 'sfx.interaction.hold-start',
    src: AudioAsset3,
    type: 'sfx',
    channels: 4,
    volume: 1,
  },
  'sfx.navigation.back': {
    id: 'sfx.navigation.back',
    src: AudioAsset4,
    type: 'sfx',
    channels: 4,
    volume: 0.34,
  },
  'sfx.selection.default': {
    id: 'sfx.selection.default',
    src: AudioAsset5,
    type: 'sfx',
    channels: 4,
    volume: 1,
  },
  'sfx.selection.slider': {
    id: 'sfx.selection.slider',
    src: AudioAsset6,
    type: 'sfx',
    channels: 4,
    volume: 0.37,
  },
} as const

export const AUDIO_GROUPS = {
  'sfx': [
    'sfx.interaction.hold-complete',
    'sfx.interaction.hold-progress',
    'sfx.interaction.hold-start',
    'sfx.navigation.back',
    'sfx.selection.default',
    'sfx.selection.slider',
  ],
  'sfx.interaction': [
    'sfx.interaction.hold-complete',
    'sfx.interaction.hold-progress',
    'sfx.interaction.hold-start',
  ],
  'sfx.navigation': [
    'sfx.navigation.back',
  ],
  'sfx.selection': [
    'sfx.selection.default',
    'sfx.selection.slider',
  ],
} as const
