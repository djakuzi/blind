<script setup lang="ts">
import { computed } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppCard from '@/app/shared/components/atoms/card/AppCard.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import AppSwitch from '@/app/shared/components/ui/control/AppSwitch.vue';
import WidgetList from '@/app/shared/components/widgets/list/WidgetList.vue';
import { APP_SCALE_SYSTEM_MODE, isAppScaleMode } from '@/app/styles/contracts/appScale.contract';
import { isAppThemeMode } from '@/app/styles/contracts/appTheme.contract';
import { SETTINGS_SCALE_OPTIONS, SETTINGS_THEME_OPTIONS } from '../constants/settingsOptions.const';
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

const {
  appThemeMode,
  appScaleMode,
  soundEnabled,
  currentLanguage,
  locale,
  languageOptions,
  setAppThemeMode,
  setAppScaleMode,
  setSoundEnabled,
  setLanguage,
} = useSettings();

const settingsLocale = computed(() =>
  locale.value?.views.menu.settings.index,
);

const settingsLabelMap = computed(() => ({
  theme: settingsLocale.value?.theme ?? '',
  scale: settingsLocale.value?.scale ?? '',
  sound: settingsLocale.value?.sound ?? '',
  language: settingsLocale.value?.language ?? '',
}));

async function handleThemeModeChange(
  value: string,
) {
  if (!isAppThemeMode(value)) {
    return;
  }

  await setAppThemeMode(value);
}

async function handleScaleModeChange(
  value: string,
) {
  if (
    !isAppScaleMode(value)
    || value === APP_SCALE_SYSTEM_MODE
  ) {
    return;
  }

  await setAppScaleMode(value);
}

function handleSoundEnabledChange(
  value: boolean,
) {
  setSoundEnabled(value);
}

async function handleLanguageChange(
  value: string,
) {
  await setLanguage(value);
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
  >
    <WidgetList
      :items="SETTINGS_ITEMS"
      item-key="id"
      width="100%"
      padding-x="0"
      :padding-y="10"
      :row-gap="6"
      row-wrap="wrap"
      divider-color="border-default"
      divider-width="thin"
      :accessibility-label="settingsLocale?.accessibilityLabel ?? ''"
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

        <AppFlex
          class="widget-settings-panel__control"
          align="center"
          justify="end"
          width="100%"
          max-width="60rem"
        >
          <AppSegmentedControl
            v-if="item.id === 'theme'"
            :model-value="appThemeMode"
            :options="SETTINGS_THEME_OPTIONS"
            size="big"
            width="100%"
            @update:model-value="handleThemeModeChange"
          />

          <AppSegmentedControl
            v-else-if="item.id === 'scale'"
            :model-value="appScaleMode"
            :options="SETTINGS_SCALE_OPTIONS"
            size="big"
            width="100%"
            @update:model-value="handleScaleModeChange"
          />

          <AppSwitch
            v-else-if="item.id === 'sound'"
            :model-value="soundEnabled"
            :accessibility-label="settingsLocale?.sound ?? ''"
            width="12rem"
            @update:model-value="handleSoundEnabledChange"
          />

          <AppSegmentedControl
            v-else
            :model-value="currentLanguage?.key ?? ''"
            :options="languageOptions"
            size="big"
            width="100%"
            @update:model-value="handleLanguageChange"
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
