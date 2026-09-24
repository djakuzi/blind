/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_MODE?: 'debug' | 'prod'
  readonly APP_DEEPLINK_SCHEME?: string
  readonly APP_STATE_CHECK_VERSION?: string
  readonly APP_STATE_CHECK_VERSION_PROMPT?: string
  readonly API_TARGET?: string
  readonly APP_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
