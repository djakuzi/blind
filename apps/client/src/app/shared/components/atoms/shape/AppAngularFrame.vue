<script setup lang="ts">
import { computed } from 'vue';
import type { PropsBorder } from '@/app/shared/types/props/surface.props';
import { resolveBorderWidthValue } from '@/app/shared/styles/contracts/border.contract';
import { resolveColorValue } from '@/app/shared/styles/contracts/color.contract';
import { resolveRadiusValue } from '@/app/shared/styles/contracts/radius.contract';

export type PropsAppAngularFrame = Pick<PropsBorder, 'borderColor' | 'borderWidth' | 'borderRadius'>;

const props = withDefaults(defineProps<PropsAppAngularFrame>(), {
  borderColor: 'border-contrast',
  borderWidth: 'thick',
  borderRadius: 'md',
});

const frameBorderColor = computed(() => resolveColorValue(props.borderColor));
const frameBorderWidth = computed(() => resolveBorderWidthValue(props.borderWidth));
const frameCornerCut = computed(() => resolveRadiusValue(props.borderRadius));
</script>

<template>
  <div class="app-angular-frame">
    <div class="app-angular-frame__inner"><slot /></div>
  </div>
</template>

<style scoped>
.app-angular-frame,
.app-angular-frame__inner {
  clip-path: polygon(
    0 var(--cp-angular-frame-cut),
    var(--cp-angular-frame-cut) 0,
    calc(100% - var(--cp-angular-frame-cut)) 0,
    100% var(--cp-angular-frame-cut),
    100% calc(100% - var(--cp-angular-frame-cut)),
    calc(100% - var(--cp-angular-frame-cut)) 100%,
    var(--cp-angular-frame-cut) 100%,
    0 calc(100% - var(--cp-angular-frame-cut))
  );
}

.app-angular-frame {
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  height: 100%;
  --cp-angular-frame-cut: v-bind(frameCornerCut);
  padding: v-bind(frameBorderWidth);
}

.app-angular-frame::before {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  --cp-angular-frame-width: v-bind(frameBorderWidth);
  background: v-bind(frameBorderColor);
  clip-path: polygon(
    evenodd,
    0 0,
    100% 0,
    100% 100%,
    0 100%,
    0 0,
    var(--cp-angular-frame-width) calc(var(--cp-angular-frame-width) + var(--cp-angular-frame-cut)),
    var(--cp-angular-frame-width) calc(100% - var(--cp-angular-frame-width) - var(--cp-angular-frame-cut)),
    calc(var(--cp-angular-frame-width) + var(--cp-angular-frame-cut)) calc(100% - var(--cp-angular-frame-width)),
    calc(100% - var(--cp-angular-frame-width) - var(--cp-angular-frame-cut)) calc(100% - var(--cp-angular-frame-width)),
    calc(100% - var(--cp-angular-frame-width)) calc(100% - var(--cp-angular-frame-width) - var(--cp-angular-frame-cut)),
    calc(100% - var(--cp-angular-frame-width)) calc(var(--cp-angular-frame-width) + var(--cp-angular-frame-cut)),
    calc(100% - var(--cp-angular-frame-width) - var(--cp-angular-frame-cut)) var(--cp-angular-frame-width),
    calc(var(--cp-angular-frame-width) + var(--cp-angular-frame-cut)) var(--cp-angular-frame-width),
    var(--cp-angular-frame-width) calc(var(--cp-angular-frame-width) + var(--cp-angular-frame-cut))
  );
  content: '';
  pointer-events: none;
  transition: 0.3s background-color linear;
}

.app-angular-frame__inner {
  min-width: 0;
  height: 100%;
}
</style>
