<script setup lang="ts">
import WidgetSliderGameMode from '@/app/features/game/widgets/WidgetSliderGameMode.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
</script>

<template>
  <ViewLayout
    class="view-game-mode"
    align="center"
    justify="center"
    padding="none"
    overflow="hidden"
    bleed="horizontal"
  >
    <WidgetSliderGameMode />
  </ViewLayout>
</template>

<style scoped>
.view-game-mode {
  position: relative;
}
</style>