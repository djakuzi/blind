import AudioAsset1 from '@/assets/audio/sfx/interaction/hold-complete.wav'

export const AUDIO_ASSETS = {
  'sfx.interaction.hold-complete': {
    id: 'sfx.interaction.hold-complete',
    src: AudioAsset1,
    type: 'sfx',
  },
} as const

export type tAudioId = keyof typeof AUDIO_ASSETS
export type tAudioType = 'sfx' | 'music'
