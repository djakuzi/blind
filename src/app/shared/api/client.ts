import { ApiClient } from '@/core/api';

export const apiClient = new ApiClient({
  baseUrl: '',
  timeout: 10_000,
});
