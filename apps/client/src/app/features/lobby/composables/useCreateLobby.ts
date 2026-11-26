import { useRouter } from 'vue-router';
import { mockLobbyService } from '@/app/features/lobby/services/MockLobby.service';
import type { iCreateLobbyOptions } from '@/app/domain/game/type/lobby/lobby.types';
import { KEY_ROUTE } from '@/app/router/constants/route.const';

export function useCreateLobby() {
  const router = useRouter();

  async function createLobby(options: iCreateLobbyOptions, entry: 'create' | 'quickMatch' = 'create') {
    const result = await mockLobbyService.create(options);

    if (result.status === 'success') {
      await router.push({ name: KEY_ROUTE.lobby.index, query: { ...options, ...(entry === 'quickMatch' ? { entry } : {}) } });
    }

    return result;
  }

  return { createLobby };
}
