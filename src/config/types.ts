export type AppMode = 'prod' | 'dev'

export interface ApiConfig {
  baseUrl: string
  api: string
}

export interface AppDeepLinkConfig {
  scheme: string
}

export interface AppStateConfig {
  checkVersion: boolean
  checkVersionPrompt: boolean
}

export interface AppConfig {
  mode: AppMode
  version: string
  state: AppStateConfig
  deepLink: AppDeepLinkConfig
}

export interface AppConfigShape {
  app: AppConfig
  api: ApiConfig
}
