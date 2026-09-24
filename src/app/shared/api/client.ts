import { config } from '@/config';
import { HttpClient } from '@/core/http';

export const apiClient = new HttpClient({
  baseUrl: config.api.baseUrl,
  timeout: 10_000,
});
