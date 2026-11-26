import { readonly, ref } from 'vue';

const isOpen = ref(false);

export function useOnlineEntryOverlay() {
  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return { isOpen: readonly(isOpen), open, close };
}
