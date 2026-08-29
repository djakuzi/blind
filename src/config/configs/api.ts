import type { ApiConfig, AppMode } from '../types'

export function createApiConfig(mode: AppMode): ApiConfig {
  const isProd = mode === 'prod'
  const apiTarget = isProd
    ? import.meta.env.API_TARGET_PROD
    : import.meta.env.API_TARGET_DEV

  if (!apiTarget) {
    throw new Error(
      isProd
        ? 'API_TARGET_PROD is not configured'
        : 'API_TARGET_DEV is not configured',
    )
  }

  const baseUrl = `${apiTarget}`
  const api = `${apiTarget}/api/`

  return {
    baseUrl,
    api,
  }
}
