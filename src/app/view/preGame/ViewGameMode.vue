<script setup lang="ts">
import WidgetSliderGameMode from '@/app/features/game/widgets/WidgetSliderGameMode.vue';
import ViewLayout from '@/app/layouts/components/view/ViewLayout.vue';
import AppHoldHint from '@/app/shared/components/ui/hint/AppHoldHint.vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';

</script>

<template>
  <ViewLayout
    class="view-game-mode"
    align="center"
    justify="center"
    padding="none"
    overflow="hidden"
  >
    <AppFlex
      direction="column"
      align="center"
      width="100%"
      :gap="16"
    >
      <WidgetSliderGameMode />

      <AppHoldHint text="Удерживайте, чтобы начать" />
    </AppFlex>
  </ViewLayout>
</template>

<style scoped>
.view-game-mode {
  position: relative;
  width: 100%;
}
</style>