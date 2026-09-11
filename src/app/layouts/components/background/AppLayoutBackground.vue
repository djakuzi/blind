<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import backgroundLight from '@/assets/images/background/bgLight.png';
import backgroundDark from '@/assets/images/background/bgDark.png';
import { useAppThemeMode } from '@/app/shared/composables/system/useAppThemeMode';
import { ToolSystem } from '@/core/tool/system';

type tThemeMode = ToolSystem.tSystemThemeMode;

interface Props {
  tileWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  tileWidth: 480,
});

const { resolvedThemeMode } = useAppThemeMode();

const sourceMap: Record<tThemeMode, string> = {
  light: backgroundLight,
  dark: backgroundDark,
};

const shouldLoad = reactive<Record<tThemeMode, boolean>>({
  light: false,
  dark: false,
});

const isLoaded = reactive<Record<tThemeMode, boolean>>({
  light: false,
  dark: false,
});

const displayedThemeMode = ref<tThemeMode>(resolvedThemeMode.value);

const backgroundSize = computed(() => `${Math.max(1, props.tileWidth)}px auto`);

function getOppositeThemeMode(themeMode: tThemeMode): tThemeMode {
  return themeMode === 'light' ? 'dark' : 'light';
}

function loadTheme(themeMode: tThemeMode) {
  shouldLoad[themeMode] = true;
}

function handleLoad(themeMode: tThemeMode) {
  isLoaded[themeMode] = true;

  if (resolvedThemeMode.value === themeMode) {
    displayedThemeMode.value = themeMode;
  }

  loadTheme(getOppositeThemeMode(themeMode));
}

function isThemeVisible(themeMode: tThemeMode) {
  return displayedThemeMode.value === themeMode && isLoaded[themeMode];
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
    <div
      v-for="themeMode in (['light', 'dark'] as const)"
      :key="themeMode"
      class="app-layout-background__layer"
      :class="{
        'app-layout-background__layer--visible':
          isThemeVisible(themeMode),
      }"
      :style="{
        backgroundImage: shouldLoad[themeMode]
          ? `url(${sourceMap[themeMode]})`
          : undefined,
      }"
    >
      <img
        v-if="shouldLoad[themeMode] && !isLoaded[themeMode]"
        class="app-layout-background__preload"
        :src="sourceMap[themeMode]"
        alt=""
        @load="handleLoad(themeMode)"
      >
    </div>
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

.app-layout-background__layer {
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  background-position: center;
  background-size: v-bind(backgroundSize);
  opacity: 0;
  pointer-events: none;
  transition: opacity 320ms ease;
}

.app-layout-background__layer--visible {
  opacity: 1;
}

.app-layout-background__preload {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .app-layout-background__layer {
    transition: none;
  }
}
</style>