<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import AppPosition from '@/app/shared/components/atoms/layer/AppPosition.vue';
import { useLoaderProvider } from '@/app/overlay/loader/composables/useLoaderProvider';
import WidgetLoaderApp from '@/app/overlay/loader/widgets/WidgetLoaderApp.vue';

const loader = useLoaderProvider();

const LOADER_ROOT_SELECTOR = '[data-app-loader-root]';
const FOCUSABLE_SELECTOR = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

function getLoaderRoot() {
  return document.querySelector<HTMLElement>(LOADER_ROOT_SELECTOR);
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (!loader.isInputBlocked.value) {
    return;
  }

  if (!loader.isVisible.value) {
    if (!event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    return;
  }

  const loaderRoot = getLoaderRoot();
  const target = event.target;

  if (!loaderRoot || !(target instanceof Node) || !loaderRoot.contains(target)) {
    if (!event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = Array.from(loaderRoot.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

  if (focusableElements.length === 0) {
    event.preventDefault();
    loaderRoot.focus({ preventScroll: true });
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (!firstElement || !lastElement) {
    return;
  }

  if (document.activeElement === loaderRoot) {
    event.preventDefault();

    if (event.shiftKey) {
      lastElement.focus({ preventScroll: true });
    } else {
      firstElement.focus({ preventScroll: true });
    }

    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus({ preventScroll: true });
  }
}

watch(
  () => loader.isVisible.value,
  async (isVisible) => {
    if (!isVisible) {
      return;
    }

    await nextTick();
    getLoaderRoot()?.focus({ preventScroll: true });
  },
);

onMounted(() => {
  document.addEventListener('keydown', handleDocumentKeydown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleDocumentKeydown, true);
});
</script>

<template>
  <AppPosition
    :is-show="loader.isInteractionBlocked.value"
    class="provider-loader-app__blocker"
    type="fixed"
    layer="loader"
    :position="{
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }"
  />

  <WidgetLoaderApp
    :is-visible="loader.isVisible.value"
    :progress="loader.progress.value"
    :progress-mode="loader.progressMode.value"
    :text="loader.text.value"
    :error="loader.error.value"
    @hidden="loader.handleHidden"
  />
</template>

<style scoped>
.provider-loader-app__blocker {
  background: transparent;
}
</style>
