import { onBeforeUnmount, onMounted } from 'vue';
import type { Ref } from 'vue';

type tResizeObserverTarget = Ref<Element | null | undefined>;

export function useResizeObserver(targets: readonly tResizeObserverTarget[], callback: ResizeObserverCallback) {
  let observer: ResizeObserver | undefined;

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    observer = new ResizeObserver(callback);

    targets.forEach((target) => {
      if (target.value) {
        observer?.observe(target.value);
      }
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
  });
}
