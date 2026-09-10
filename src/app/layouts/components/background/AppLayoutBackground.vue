<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

import test from '@/assets/images/background/bgDark.png';
import backgroundLight from '@/assets/images/background/bgLight.png';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';
import { ToolSystem } from '@/core/tool/system';

type tThemeMode = ToolSystem.tSystemThemeMode;

const { resolvedThemeMode } = useAppThemeMode();

const sourceMap: Record<tThemeMode, string> = {
  light: backgroundLight,
  dark: test,
};

const shouldLoad = reactive<Record<tThemeMode, boolean>>({
  light: false,
  dark: false,
});

const isLoaded = reactive<Record<tThemeMode, boolean>>({
  light: false,
  dark: false,
});

const displayedThemeMode = ref<tThemeMode>(
  resolvedThemeMode.value,
);

function getOppositeThemeMode(
  themeMode: tThemeMode,
): tThemeMode {
  return themeMode === 'light'
    ? 'dark'
    : 'light';
}

function loadTheme(
  themeMode: tThemeMode,
) {
  shouldLoad[themeMode] = true;
}

function handleLoad(
  themeMode: tThemeMode,
) {
  isLoaded[themeMode] = true;

  if (resolvedThemeMode.value === themeMode) {
    displayedThemeMode.value = themeMode;
  }

  loadTheme(
    getOppositeThemeMode(themeMode),
  );
}

function isThemeVisible(
  themeMode: tThemeMode,
) {
  return (
    displayedThemeMode.value === themeMode
    && isLoaded[themeMode]
  );
}

watch(
  resolvedThemeMode,
  (themeMode) => {
    loadTheme(themeMode);

    if (isLoaded[themeMode]) {
      displayedThemeMode.value = themeMode;
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div
    class="app-layout-background"
    aria-hidden="true"
  >
    <img
      v-if="shouldLoad.light"
      class="app-layout-background__image"
      :class="{
        'app-layout-background__image--visible':
          isThemeVisible('light'),
      }"
      :src="sourceMap.light"
      alt=""
      draggable="false"
      decoding="async"
      @load="handleLoad('light')"
    >

    <img
      v-if="shouldLoad.dark"
      class="app-layout-background__image"
      :class="{
        'app-layout-background__image--visible':
          isThemeVisible('dark'),
      }"
      :src="sourceMap.dark"
      alt=""
      draggable="false"
      decoding="async"
      @load="handleLoad('dark')"
    >
  </div>
</template>

<style scoped>
.app-layout-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  background: var(--app-color-background);
  pointer-events: none;
}

.app-layout-background__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  user-select: none;
  pointer-events: none;
  transition: opacity 320ms ease;
}

.app-layout-background__image--visible {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .app-layout-background__image {
    transition: none;
  }
}
</style>