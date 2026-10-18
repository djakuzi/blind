import { readonly, ref } from 'vue';
import type { tKeyTypeConnection } from '@/app/shared/constants/game/typeConnection.conts';

const isOpen = ref(false);
const selectedConnection = ref<tKeyTypeConnection | null>(null);

export function useSessionJoinOverlay() {
  function open() {
    selectedConnection.value = null;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  function select(connection: tKeyTypeConnection) {
    selectedConnection.value = connection;
  }

  return {
    isOpen: readonly(isOpen),
    selectedConnection: readonly(selectedConnection),
    open,
    close,
    select,
  };
}
