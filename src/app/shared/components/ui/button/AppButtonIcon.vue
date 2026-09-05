<script
  setup
  lang="ts"
>
import { computed } from 'vue';

import type { PropsAppBlock } from '@/app/shared/components/atoms/block/AppBlock.vue';
import AppIcon from '@/app/shared/components/atoms/media/AppIcon.vue';
import AppInteractionScale from '@/app/shared/components/effects/interaction/AppInteractionScale.vue';
import { LibStyle } from '@/app/shared/lib/style';
import type {
  tIconGroup,
  tIconName,
} from '@/core/media/assets';

interface Props {
  group: tIconGroup
  icon: tIconName<tIconGroup>
  width: PropsAppBlock['width']
  height?: PropsAppBlock['height']
  iconWidth?: PropsAppBlock['width']
  iconHeight?: PropsAppBlock['height']
  disabled?: boolean
  ariaLabel: string
}

const props = withDefaults(defineProps<Props>(), {
  height: undefined,
  iconWidth: '100%',
  iconHeight: '100%',
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent]
}>();

const buttonStyle = computed(() => ({
  '--cp-button-icon-width': LibStyle.toSizeValue(props.width) ?? 'auto',
  '--cp-button-icon-height': LibStyle.toSizeValue(props.height) ?? 'auto',
}));
</script>

<template>
  <AppInteractionScale :disabled="disabled">
    <button
      class="app-button-icon"
      type="button"
      :style="buttonStyle"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @click="$emit('click', $event)"
    >
      <AppIcon
        :group="group"
        :icon="icon"
        :width="iconWidth"
        :height="iconHeight"
      />
    </button>
  </AppInteractionScale>
</template>

<style scoped>
.app-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--cp-button-icon-width);
  height: var(--cp-button-icon-height);

  padding: 0;
  border: 0;

  background: transparent;

  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.app-button-icon:disabled {
  cursor: default;
}
</style>