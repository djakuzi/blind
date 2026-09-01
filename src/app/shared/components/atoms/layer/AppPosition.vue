<script setup lang="ts">
import { computed } from 'vue';

import type { tLayerValue } from '@/app/styles/contracts/layer.contract';
import { resolveLayerValue } from '@/app/styles/contracts/layer.contract';
import type { tSafeAreaToken } from '@/app/styles/contracts/safeArea.contract';
import { isSafeAreaToken, safeAreaTokenVar } from '@/app/styles/contracts/safeArea.contract';
import type { tSpaceValue } from '@/app/styles/contracts/space.contract';
import { resolveSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppPositionType = 'fixed' | 'absolute' | 'relative' | 'sticky';
type tAppPositionCenter = 'x' | 'y' | 'xy';
type tAppPositionOffsetValue = tSpaceValue | tSafeAreaToken;

interface iAppPositionOffsets {
  top?: tAppPositionOffsetValue
  right?: tAppPositionOffsetValue
  bottom?: tAppPositionOffsetValue
  left?: tAppPositionOffsetValue
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
  props.center ? `app-position--center-${props.center}` : undefined,
]);

function resolvePositionOffsetValue(value?: tAppPositionOffsetValue) {
  return typeof value === 'string' && isSafeAreaToken(value)
    ? safeAreaTokenVar(value)
    : resolveSpaceValue(value);
}

const positionStyle = computed(() => ({
  '--cp-position-type': props.type,
  '--cp-position-layer': resolveLayerValue(props.layer),
  '--cp-position-top': resolvePositionOffsetValue(props.position?.top) ?? 'auto',
  '--cp-position-right': resolvePositionOffsetValue(props.position?.right) ?? 'auto',
  '--cp-position-bottom': resolvePositionOffsetValue(props.position?.bottom) ?? 'auto',
  '--cp-position-left': resolvePositionOffsetValue(props.position?.left) ?? 'auto',
}));
</script>

<template>
  <div
    v-if="isShow"
    :class="positionClass"
    :style="positionStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
.app-position {
  --cp-position-transform: none;

  position: var(--cp-position-type);
  z-index: var(--cp-position-layer);
  top: var(--cp-position-top);
  right: var(--cp-position-right);
  bottom: var(--cp-position-bottom);
  left: var(--cp-position-left);
  transform: var(--cp-position-transform);
}

.app-position--center-x {
  --cp-position-left: 50%;
  --cp-position-transform: translateX(-50%);
}

.app-position--center-y {
  --cp-position-top: 50%;
  --cp-position-transform: translateY(-50%);
}

.app-position--center-xy {
  --cp-position-top: 50%;
  --cp-position-left: 50%;
  --cp-position-transform: translate(-50%, -50%);
}
</style>
