<script setup lang="ts">
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
import { ref } from 'vue';
import AppSwitch from '@/app/shared/components/ui/control/AppSwitch.vue';
const soundEnabled = ref(true);
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

  <AppSwitch
    v-model="soundEnabled"
    accessibility-label="Звук"
  />
  </ViewLayout>
</template>

<style scoped>
</style>
