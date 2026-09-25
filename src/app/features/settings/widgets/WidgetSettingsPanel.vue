<script setup lang="ts">
import { computed, ref } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppCard from '@/app/shared/components/atoms/card/AppCard.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import AppSwitch from '@/app/shared/components/ui/control/AppSwitch.vue';
import WidgetList from '@/app/shared/components/widgets/list/WidgetList.vue';
import WidgetSearchPicker from '@/app/shared/components/widgets/picker/WidgetSearchPicker.vue';
import type { iWidgetSearchPickerItem } from '@/app/shared/components/widgets/picker/WidgetSearchPicker.vue';
import { APP_SCALE_SYSTEM_MODE, isAppScaleMode } from '@/app/styles/contracts/appScale.contract';
import { isAppThemeMode } from '@/app/styles/contracts/appTheme.contract';
import type { ModelLanguage } from '@/app/domain/lang/models/Language.model';
import { useAppLanguage } from '@/app/features/locale/composables/useAppLanguage';
import { useLocale } from '@/app/features/locale/composables/useLocale';
import { LibText } from '@/app/shared/lib/text';
import { SETTINGS_SCALE_VALUES, SETTINGS_THEME_VALUES } from '../constants/settingsOptions.const';
import { useSettings } from '../composables/useSettings';

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

const { languages, currentLanguage, setAppLanguage } = useAppLanguage();

const isLanguagePickerOpen = ref(false);

const locale = useLocale();

const currentLanguageCode = computed(() => {
  if (!currentLanguage.value) {
    throw new Error('Current language is not initialized');
  }

  return currentLanguage.value.key;
});

const settingsLocale = computed(() => locale.value.views.settings.index.ui);

const changeLanguageModalLocale = computed(() => locale.value.views.settings.index.modals.changeLanguage);

const settingsLabelMap = computed(() => ({
  theme: settingsLocale.value.theme,
  scale: settingsLocale.value.scale,
  sound: settingsLocale.value.sound,
  language: settingsLocale.value.language,
}));

const themeOptions = computed(() =>
  SETTINGS_THEME_VALUES.map((value) => ({
    value,
    label: locale.value.settings.theme[value],
  })),
);

const scaleOptions = computed(() =>
  SETTINGS_SCALE_VALUES.map((value) => ({
    value,
    label: locale.value.settings.scale[value],
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

const languagePickerItems = computed(() => languages.value.map(createLanguagePickerItem));

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

function handleSoundEnabledChange(value: boolean) {
  setSoundEnabled(value);
}

async function handleLanguageChange(value: string) {
  await setAppLanguage(value);
  isLanguagePickerOpen.value = false;
}
</script>

<template>
  <AppCard class="widget-settings-panel" tag="section" width="140rem" max-width="100%" :padding-x="10" padding-y="0">
    <WidgetList
      :items="SETTINGS_ITEMS"
      item-key="id"
      width="100%"
      padding-x="0"
      :padding-y="10"
      :row-gap="6"
      divider-color="border-default"
      divider-width="thin"
      :accessibility-label="settingsLocale.accessibilityLabel"
    >
      <template #item="{ item }">
        <AppText
          :text="settingsLabelMap[item.id]"
          tag="span"
          font-size="xl"
          font-weight="medium"
          :uppercase="true"
          :ellipsis="true"
          :max-lines="1"
        />

        <AppFlex class="widget-settings-panel__control" align="center" justify="end" width="100%" max-width="60rem">
          <AppSegmentedControl
            v-if="item.id === 'theme'"
            :model-value="appThemeMode"
            :options="themeOptions"
            size="big"
            width="100%"
            @update:model-value="handleThemeModeChange"
          />

          <AppSegmentedControl
            v-else-if="item.id === 'scale'"
            :model-value="appScaleMode"
            :options="scaleOptions"
            size="big"
            width="100%"
            @update:model-value="handleScaleModeChange"
          />

          <AppSwitch
            v-else-if="item.id === 'sound'"
            :model-value="soundEnabled"
            :accessibility-label="settingsLocale.sound"
            width="12rem"
            @update:model-value="handleSoundEnabledChange"
          />

          <WidgetSearchPicker
            v-else
            v-model="isLanguagePickerOpen"
            :items="languagePickerItems"
            :selected-value="currentLanguage?.key"
            :title="changeLanguageModalLocale.title"
            :empty-text="changeLanguageModalLocale.emptyText"
            :trigger-aria-label="settingsLocale.changeLanguage"
            :search="{
              placeholder: changeLanguageModalLocale.searchPlaceholder,
              ariaLabel: changeLanguageModalLocale.searchPlaceholder,
              size: 'big',
            }"
            :row="{
              size: 'big',
            }"
            @select="handleLanguageChange"
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

.widget-settings-panel__control {
  margin-left: auto;
}
</style>
