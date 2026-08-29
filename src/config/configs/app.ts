import { LibBoolean } from '../../shared/lib/boolean'
import type { AppConfig, AppMode } from '../types'

export function createAppConfig(mode: AppMode): AppConfig {
  return {
    mode,
    version: (import.meta.env.APP_VERSION ?? '').trim() || '0.0.0',
    state: {
      checkVersion: LibBoolean.toValue(import.meta.env.APP_STATE_CHECK_VERSION),
      checkVersionPrompt: LibBoolean.toValue(import.meta.env.APP_STATE_CHECK_VERSION_PROMPT),
    },
    deepLink: {
      scheme: (import.meta.env.APP_DEEPLINK_SCHEME ?? 'blind').trim() || 'blind',
    }
  }
}
