<template>
  <header class="layout-header">
    <slot />
  </header>
</template>

<style scoped>
.layout-header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: var(--app-space-14);
  box-sizing: border-box;
}
</style>
