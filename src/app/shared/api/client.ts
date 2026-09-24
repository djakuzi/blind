import { config } from '@/config';
import { HttpClient } from '@/core/http';

export const apiClient = new HttpClient({
  baseUrl: config.api.api,
  timeout: 10_000,
});

export const publicClient = new HttpClient({
  baseUrl: '',
  timeout: 10_000,
});
