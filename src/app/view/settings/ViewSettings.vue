<script setup lang="ts">
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import { ref } from 'vue';
import AppSwitch from '@/app/shared/components/ui/control/AppSwitch.vue';
import AppCard from '@/app/shared/components/ui/card/AppCard.vue';
const soundEnabled = ref(true);
const theme = ref('light');
</script>

<template>
  <ViewLayout>
    <AppText
      text="ТЕМА ПРИЛОЖЕНИЯ"
      fontSize="3xl"
      fontWeight="medium"
      uppercase
      :ellipsis="true"
    />

    <AppTitle
      text="Выберите тему приложения"
      color="text-primary"
      fontSize="2xl"
      fontWeight="medium"
    />

  <!-- <AppSwitch
    v-model="soundEnabled"
    accessibility-label="Звук"
  /> -->

      <AppSegmentedControl
        v-model="theme"
        width="32rem"
        :options="[
          {
            label: 'Светлая',
            value: 'light',
          },
          {
            label: 'Тёмная',
            value: 'dark',
          },
        ]"
      />

<AppCard
  tag="section"
  width="100%"
  max-width="75rem"
  size="big"
>
  ...
</AppCard>
  </ViewLayout>
</template>

<style scoped>
</style>
