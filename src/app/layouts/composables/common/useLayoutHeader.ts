import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useLayoutHeader() {
  const route = useRoute();

  const hasLayoutHeader = computed(() => route.meta.layout?.header !== false);

  return {
    hasLayoutHeader,
  };
}
