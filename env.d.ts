/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_MODE?: 'dev' | 'prod'
  readonly APP_DEEPLINK_SCHEME?: string
  readonly API_TARGET_PROD?: string
  readonly API_TARGET_DEV?: string
  readonly APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
