import { onBeforeUnmount, onMounted } from 'vue';

export interface iUseEventListenerOptions extends AddEventListenerOptions {
  autoStart?: boolean;
}

export function useEventListener<TEvent extends Event>(
  target: EventTarget,
  type: string,
  listener: (event: TEvent) => void,
  options: iUseEventListenerOptions = {},
) {
  const { autoStart = true, ...eventOptions } = options;

  const eventListener = listener as EventListener;
  let isListening = false;

  function start() {
    if (isListening) {
      return;
    }

    target.addEventListener(type, eventListener, eventOptions);
    isListening = true;
  }

  function stop() {
    if (!isListening) {
      return;
    }

    target.removeEventListener(type, eventListener, eventOptions);
    isListening = false;
  }

  onMounted(() => {
    if (autoStart) {
      start();
    }
  });

  onBeforeUnmount(() => {
    stop();
  });

  return {
    start,
    stop,
  };
}
