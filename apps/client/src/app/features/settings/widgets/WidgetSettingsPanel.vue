<script setup lang="ts">
import { computed } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppMarqueeText from '@/app/shared/components/ui/text/AppMarqueeText.vue';
import AppCard from '@/app/shared/components/elements/card/AppCard.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import WidgetList from '@/app/shared/components/widgets/list/WidgetList.vue';
import WidgetSearchPicker from '@/app/shared/components/widgets/picker/WidgetSearchPicker.vue';
import type { iWidgetSearchPickerItem } from '@/app/shared/components/widgets/picker/WidgetSearchPicker.vue';
import { APP_SCALE_SYSTEM_MODE, isAppScaleMode } from '@/app/shared/styles/contracts/appScale.contract';
import { isAppThemeMode } from '@/app/shared/styles/contracts/appTheme.contract';
import type { ModelLanguage } from '@/app/domain/lang/models/Language.model';
import type { Locale } from '@/app/shared/types/locale';
import { LibText } from '@/core/lib/text';
import { SETTINGS_SCALE_VALUES, SETTINGS_SOUND_VALUES, SETTINGS_THEME_VALUES } from '../constants/settingsOptions.const';
import { useSettings } from '../composables/useSettings';

export interface PropsWidgetSettingsPanel {
  locale: {
    settings: Locale['settings'];
    ui: Locale['views']['settings']['index']['ui'];
    languageModal: Locale['views']['settings']['index']['modals']['changeLanguage'];
  };
  languages: readonly ModelLanguage[];
  currentLanguage: ModelLanguage | null;
}

const props = defineProps<PropsWidgetSettingsPanel>();
const emit = defineEmits<{ 'select-language': [code: string] }>();
const isLanguagePickerOpen = defineModel<boolean>('languagePickerOpen', { default: false });

const SETTINGS_ITEMS = [
  {
    id: 'theme',
  },
  {
    id: 'scale',
  },
  {
    id: 'sound',
  },
  {
    id: 'language',
  },
] as const;

const { appThemeMode, appScaleMode, soundEnabled, setAppThemeMode, setAppScaleMode, setSoundEnabled } = useSettings();

const currentLanguageCode = computed(() => {
  if (!props.currentLanguage) {
    throw new Error('Current language is not initialized');
  }

  return props.currentLanguage.key;
});

const settingsLabelMap = computed(() => ({
  theme: props.locale.ui.theme,
  scale: props.locale.ui.scale,
  sound: props.locale.ui.sound,
  language: props.locale.ui.language,
}));

const themeOptions = computed(() =>
  SETTINGS_THEME_VALUES.map((value) => ({
    value,
    label: props.locale.settings.theme[value],
  })),
);

const scaleOptions = computed(() =>
  SETTINGS_SCALE_VALUES.map((value) => ({
    value,
    label: props.locale.settings.scale[value],
  })),
);

const soundOptions = computed(() =>
  SETTINGS_SOUND_VALUES.map((value) => ({
    value,
    label: props.locale.settings.sound[value],
  })),
);

function getLanguageDisplayName(language: ModelLanguage) {
  return LibText.getLanguageDisplayName(language.key, currentLanguageCode.value) ?? language.name;
}

function createLanguagePickerItem(language: ModelLanguage): iWidgetSearchPickerItem {
  return {
    value: language.key,
    label: getLanguageDisplayName(language),
    image: language.img
      ? {
          src: language.img,
          alt: '',
          loading: 'lazy',
        }
      : undefined,
  };
}

const languagePickerItems = computed(() => props.languages.map(createLanguagePickerItem));

async function handleThemeModeChange(value: string) {
  if (!isAppThemeMode(value)) {
    return;
  }

  await setAppThemeMode(value);
}

async function handleScaleModeChange(value: string) {
  if (!isAppScaleMode(value) || value === APP_SCALE_SYSTEM_MODE) {
    return;
  }

  await setAppScaleMode(value);
}

function handleSoundEnabledChange(value: string) {
  if (value !== 'on' && value !== 'off') {
    return;
  }

  setSoundEnabled(value === 'on');
}
</script>

<template>
  <AppCard
    class="widget-settings-panel"
    tag="section"
    width="140rem"
    max-width="100%"
    :padding-x="10"
    padding-y="0"
    corner-style="angular"
    background-color="surface-primary"
    border-color="border-contrast"
    border-width="thick"
    border-radius="xl"
  >
    <WidgetList
      :items="SETTINGS_ITEMS"
      item-key="id"
      width="100%"
      padding-x="0"
      :padding-y="10"
      :options-row="{ gap: 6 }"
      :options-divider="{ color: 'border-default', width: 'thin' }"
      :accessibility-label="locale.ui.accessibilityLabel"
    >
      <template #item="{ item }">
        <AppMarqueeText
          class="widget-settings-panel__label"
          :text="settingsLabelMap[item.id]"
          font-size="xl"
          font-weight="medium"
          :uppercase="true"
        />

        <AppFlex class="widget-settings-panel__control" align="center" justify="end" width="100%" max-width="60rem">
          <AppSegmentedControl
            v-if="item.id === 'theme'"
            :model-value="appThemeMode"
            :options="themeOptions"
            size="big"
            width="fit-content"
            max-width="100%"
            @update:model-value="handleThemeModeChange"
          />

          <AppSegmentedControl
            v-else-if="item.id === 'scale'"
            :model-value="appScaleMode"
            :options="scaleOptions"
            size="big"
            width="fit-content"
            max-width="100%"
            @update:model-value="handleScaleModeChange"
          />

          <AppSegmentedControl
            v-else-if="item.id === 'sound'"
            :model-value="soundEnabled ? 'on' : 'off'"
            :options="soundOptions"
            :sound="null"
            size="big"
            width="fit-content"
            max-width="100%"
            @update:model-value="handleSoundEnabledChange"
          />

          <WidgetSearchPicker
            v-else
            v-model="isLanguagePickerOpen"
            width="fit-content"
            max-width="100%"
            :items="languagePickerItems"
            :selected-value="currentLanguage?.key"
            :title="locale.languageModal.title"
            :empty-text="locale.languageModal.emptyText"
            :trigger-aria-label="locale.ui.changeLanguage"
            :options-modal="{
              maxWidth: '50rem',
            }"
            :options-search="{
              placeholder: locale.languageModal.searchPlaceholder,
              ariaLabel: locale.languageModal.searchPlaceholder,
              size: 'big',
            }"
            :options-row="{
              size: 'big',
            }"
            @select="emit('select-language', $event)"
          />
        </AppFlex>
      </template>
    </WidgetList>
  </AppCard>
</template>

<style scoped>
.widget-settings-panel {
  margin-inline: auto;
}

.widget-settings-panel__label {
  flex: 1 1 auto;
  min-width: 0;
}

.widget-settings-panel__control {
  margin-left: auto;
}
</style>
