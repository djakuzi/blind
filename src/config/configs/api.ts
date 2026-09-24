import type { ApiConfig } from '../types';

export function createApiConfig(): ApiConfig {
  const apiTarget = import.meta.env.API_TARGET;

  if (!apiTarget) {
    throw new Error('API_TARGET is not configured');
  }

  const baseUrl = `${apiTarget}`;
  const api = `${apiTarget}/api/`;

  return {
    baseUrl,
    api,
  };
}
