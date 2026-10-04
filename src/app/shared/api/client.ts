import { HttpClient } from '@/core/http';

export const apiClient = new HttpClient({
  baseUrl: '',
  timeout: 10_000,
});