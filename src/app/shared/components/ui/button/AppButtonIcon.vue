<script setup lang="ts">
import AppIcon, { type PropsAppIcon } from '@/app/shared/components/atoms/media/AppIcon.vue';
import type { PropsAppBlock } from '@/app/shared/components/atoms/block/AppBlock.vue';

interface Props {
  group: PropsAppIcon['group']
  icon: PropsAppIcon['icon']
  width: PropsAppBlock['width']
  height?: PropsAppBlock['height']
  iconWidth?: PropsAppBlock['width']
  iconHeight?: PropsAppBlock['height']
  disabled?: boolean
  ariaLabel: string
}

withDefaults(defineProps<Props>(), {
  height: undefined,
  iconWidth: '100%',
  iconHeight: '100%',
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent]
}>();
</script>

<template>
  <button
    class="app-button-icon"
    type="button"
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
</template>