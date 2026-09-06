<script setup lang="ts">
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppTitle from '@/app/shared/components/atoms/typography/AppTitle.vue';
import AppSegmentedControl from '@/app/shared/components/ui/control/AppSegmentedControl.vue';
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
  </ViewLayout>
</template>

<style scoped>
</style>
