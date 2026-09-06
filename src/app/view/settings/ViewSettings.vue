<script setup lang="ts">
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import { computed, ref } from 'vue';
import type {
  iWidgetSettingsListItem,
  tWidgetSettingsListChange,
} from '@/app/features/settings/widgets/WidgetSettingsList.vue';

const theme = ref('light');
const scale = ref('middle');
const soundEnabled = ref(true);

const settingsItems = computed<iWidgetSettingsListItem[]>(() => [
  {
    id: 'theme',
    text: 'Тема приложения',
    control: {
      type: 'segmented',
      modelValue: theme.value,
      props: {
        width: '100%',
        options: [
          {
            label: 'Светлая',
            value: 'light',
          },
          {
            label: 'Тёмная',
            value: 'dark',
          },
        ],
      },
    },
  },
  {
    id: 'scale',
    text: 'Размер интерфейса',
    control: {
      type: 'segmented',
      modelValue: scale.value,
      props: {
        width: '100%',
        options: [
          {
            label: 'S',
            value: 'small',
          },
          {
            label: 'M',
            value: 'middle',
          },
          {
            label: 'L',
            value: 'big',
          },
        ],
      },
    },
  },
  {
    id: 'sound',
    text: 'Звук',
    control: {
      type: 'switch',
      modelValue: soundEnabled.value,
      props: {
        size: 'small',
      },
    },
  },
]);

function handleSettingsChange(
  payload: tWidgetSettingsListChange,
) {
  if (payload.id === 'theme' && payload.type === 'segmented') {
    theme.value = payload.value;
    return;
  }

  if (payload.id === 'scale' && payload.type === 'segmented') {
    scale.value = payload.value;
    return;
  }

  if (payload.id === 'sound' && payload.type === 'switch') {
    soundEnabled.value = payload.value;
  }
}
</script>

<template>
  <ViewLayout>
    <WidgetSettingsList
      :items="settingsItems"
      size="middle"
      width="100%"
      control-width="32rem"
      @change="handleSettingsChange"
    />
  </ViewLayout>
</template>

<style scoped>
</style>
