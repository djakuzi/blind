export const AUDIO_ASSETS = {
} as const

export type tAudioId = keyof typeof AUDIO_ASSETS
export type tAudioType = 'sfx' | 'music'
