<script setup lang="ts">
import { computed } from 'vue';

import type { tLayerValue } from '@/app/styles/contracts/layer.contract';
import { isLayerToken, resolveLayerValue } from '@/app/styles/contracts/layer.contract';
import type { tSpaceValue } from '@/app/styles/contracts/space.contract';
import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppPositionType = 'fixed' | 'absolute' | 'relative' | 'sticky';
type tAppPositionCenter = 'x' | 'y' | 'xy';

interface iAppPositionOffsets {
  top?: tSpaceValue
  right?: tSpaceValue
  bottom?: tSpaceValue
  left?: tSpaceValue
}

interface Props {
  type?: tAppPositionType
  position?: iAppPositionOffsets
  center?: tAppPositionCenter
  layer?: tLayerValue
  isShow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'fixed',
  position: undefined,
  center: undefined,
  layer: 'base',
  isShow: true,
});

const positionClass = computed(() => [
  'app-position',
  `app-position--type-${props.type}`,
  typeof props.layer === 'string' && isLayerToken(props.layer)
    ? `app-position--layer-${props.layer}`
    : 'app-position--layer-custom',
  props.center ? `app-position--center-${props.center}` : 'app-position--offsets',
]);

const positionLayer = computed(() => resolveLayerValue(props.layer));
const positionTop = computed(() => resolveSpaceValue(props.position?.top));
const positionRight = computed(() => resolveSpaceValue(props.position?.right));
const positionBottom = computed(() => resolveSpaceValue(props.position?.bottom));
const positionLeft = computed(() => resolveSpaceValue(props.position?.left));
</script>

<template>
  <div
    v-if="isShow"
    :class="positionClass"
  >
    <slot />
  </div>
</template>

<style scoped>
.app-position--type-fixed {
  position: fixed;
}

.app-position--type-absolute {
  position: absolute;
}

.app-position--type-relative {
  position: relative;
}

.app-position--type-sticky {
  position: sticky;
}

.app-position--offsets {
  top: v-bind(positionTop);
  right: v-bind(positionRight);
  bottom: v-bind(positionBottom);
  left: v-bind(positionLeft);
}

.app-position--center-x {
  left: 50%;
  transform: translateX(-50%);
}

.app-position--center-y {
  top: 50%;
  transform: translateY(-50%);
}

.app-position--center-xy {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.app-position--layer-base {
  z-index: var(--app-layer-base);
}

.app-position--layer-raised {
  z-index: var(--app-layer-raised);
}

.app-position--layer-sticky {
  z-index: var(--app-layer-sticky);
}

.app-position--layer-overlay {
  z-index: var(--app-layer-overlay);
}

.app-position--layer-modal {
  z-index: var(--app-layer-modal);
}

.app-position--layer-toast {
  z-index: var(--app-layer-toast);
}

.app-position--layer-custom {
  z-index: v-bind(positionLayer);
}
</style>
