<script setup lang="ts">
import { computed } from 'vue';

import { LibStyle } from '@/app/shared/lib/style';
import type { tStyleSizeValue } from '@/app/shared/lib/style';
import { resolveSpaceValue, type tSpaceValue } from '@/app/styles/contracts/space.contract';

type tAppDistributedRowNode =
  | { type: 'item'; index: number }
  | { type: 'separator'; index: number };

export type tAppDistributedRowOverflow = 'hidden' | 'visible';

export interface PropsAppDistributedRow {
  count: number
  width?: tStyleSizeValue
  maxWidth?: tStyleSizeValue
  separatorGap?: tSpaceValue
  centerEven?: boolean
  centerOdd?: boolean
  overflow?: tAppDistributedRowOverflow
}

const props = withDefaults(defineProps<PropsAppDistributedRow>(), {
  width: '100%',
  maxWidth: '100%',
  separatorGap: 4,
  centerEven: true,
  centerOdd: true,
  overflow: 'hidden',
});

defineSlots<{
  item(props: { index: number }): unknown
  separator(props: { index: number }): unknown
}>();

const normalizedCount = computed(() => Math.max(0, Math.floor(props.count)));

const nodes = computed<tAppDistributedRowNode[]>(() => {
  const result: tAppDistributedRowNode[] = [];

  for (let index = 0; index < normalizedCount.value; index++) {
    result.push({ type: 'item', index });

    if (index < normalizedCount.value - 1) {
      result.push({ type: 'separator', index });
    }
  }

  return result;
});

const centerNodeIndex = computed(() => normalizedCount.value - 1);

const centerNode = computed(() => {
  if (centerNodeIndex.value < 0) {
    return undefined;
  }

  return nodes.value[centerNodeIndex.value];
});

const leftNodes = computed(() => {
  if (centerNodeIndex.value < 0) {
    return [];
  }

  return nodes.value.slice(0, centerNodeIndex.value);
});

const rightNodes = computed(() => {
  if (centerNodeIndex.value < 0) {
    return [];
  }

  return nodes.value.slice(centerNodeIndex.value + 1);
});

const centerByAnchor = computed(() => {
  if (!centerNode.value) {
    return false;
  }

  return normalizedCount.value % 2 === 0
    ? props.centerEven
    : props.centerOdd;
});

const rowWidth = computed(() => LibStyle.toSizeValue(props.width));
const rowMaxWidth = computed(() => LibStyle.toSizeValue(props.maxWidth));
const rowSeparatorGap = computed(() => resolveSpaceValue(props.separatorGap));
const rowOverflow = computed(() => props.overflow);
</script>

<template>
  <div class="app-distributed-row">
    <div
      v-if="centerByAnchor && centerNode"
      class="app-distributed-row__balanced"
    >
      <div class="app-distributed-row__side app-distributed-row__side--left">
        <template
          v-for="node in leftNodes"
          :key="`${node.type}-${node.index}`"
        >
          <div
            v-if="node.type === 'item'"
            class="app-distributed-row__item"
          >
            <slot
              name="item"
              :index="node.index"
            />
          </div>

          <div
            v-else
            class="app-distributed-row__separator"
          >
            <slot
              name="separator"
              :index="node.index"
            />
          </div>
        </template>
      </div>

      <div
        v-if="centerNode.type === 'item'"
        class="app-distributed-row__item app-distributed-row__anchor"
      >
        <slot
          name="item"
          :index="centerNode.index"
        />
      </div>

      <div
        v-else
        class="app-distributed-row__separator app-distributed-row__anchor"
      >
        <slot
          name="separator"
          :index="centerNode.index"
        />
      </div>

      <div class="app-distributed-row__side app-distributed-row__side--right">
        <template
          v-for="node in rightNodes"
          :key="`${node.type}-${node.index}`"
        >
          <div
            v-if="node.type === 'item'"
            class="app-distributed-row__item"
          >
            <slot
              name="item"
              :index="node.index"
            />
          </div>

          <div
            v-else
            class="app-distributed-row__separator"
          >
            <slot
              name="separator"
              :index="node.index"
            />
          </div>
        </template>
      </div>
    </div>

    <div
      v-else
      class="app-distributed-row__content"
    >
      <template
        v-for="node in nodes"
        :key="`${node.type}-${node.index}`"
      >
        <div
          v-if="node.type === 'item'"
          class="app-distributed-row__item"
        >
          <slot
            name="item"
            :index="node.index"
          />
        </div>

        <div
          v-else
          class="app-distributed-row__separator"
        >
          <slot
            name="separator"
            :index="node.index"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.app-distributed-row {
  width: v-bind(rowWidth);
  max-width: v-bind(rowMaxWidth);
  min-width: 0;
  overflow-x: v-bind(rowOverflow);
  overflow-y: hidden;
}

.app-distributed-row__balanced {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  width: 100%;
  min-width: 0;
}

.app-distributed-row__side {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: v-bind(rowOverflow);
}

.app-distributed-row__side--left {
  justify-content: flex-end;
}

.app-distributed-row__side--right {
  justify-content: flex-start;
}

.app-distributed-row__content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  margin-inline: auto;
}

.app-distributed-row__item {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
}

.app-distributed-row__separator {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  margin-inline: v-bind(rowSeparatorGap);
}

.app-distributed-row__anchor {
  min-width: 0;
  max-width: 100%;
}
</style>