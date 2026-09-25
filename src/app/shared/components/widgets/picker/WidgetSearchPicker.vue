<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppFlex from '@/app/shared/components/atoms/block/AppFlex.vue';
import AppText from '@/app/shared/components/atoms/typography/AppText.vue';
import AppModal from '@/app/shared/components/interaction/overlay/AppModal.vue';
import type { PropsAppModal } from '@/app/shared/components/interaction/overlay/AppModal.vue';
import AppInfoRow from '@/app/shared/components/ui/info/AppInfoRow.vue';
import type { iAppInfoRowImage, PropsAppInfoRow } from '@/app/shared/components/ui/info/AppInfoRow.vue';
import AppInputSearch from '@/app/shared/components/ui/input/AppInputSearch.vue';
import type { PropsInputSearch } from '@/app/shared/components/ui/input/AppInputSearch.vue';

export interface iWidgetSearchPickerItem {
  value: string;
  label: string;
  image?: iAppInfoRowImage;
  searchText?: string;
  disabled?: boolean;
}

export interface PropsWidgetSearchPicker {
  modelValue: boolean;
  items: readonly iWidgetSearchPickerItem[];
  selectedValue?: string;
  title?: string;
  emptyText?: string;
  triggerAriaLabel?: string;
  modal?: Omit<PropsAppModal, 'modelValue'>;
  search?: Omit<PropsInputSearch, 'modelValue'>;
  row?: Omit<PropsAppInfoRow, 'text' | 'image'>;
}

const props = withDefaults(defineProps<PropsWidgetSearchPicker>(), {
  selectedValue: undefined,
  title: undefined,
  emptyText: undefined,
  triggerAriaLabel: undefined,
  modal: undefined,
  search: undefined,
  row: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  select: [value: string, item: iWidgetSearchPickerItem];
}>();

defineSlots<{
  empty?(): unknown;
}>();

const searchQuery = ref('');

const selectedItem = computed(() => props.items.find((item) => item.value === props.selectedValue));

const triggerText = computed(() => selectedItem.value?.label ?? props.selectedValue ?? '');

const modalProps = computed<Omit<PropsAppModal, 'modelValue'>>(() => ({
  bodyPaddingX: 0,
  bodyPaddingY: 0,
  ariaLabel: props.modal?.ariaLabel ?? props.title,
  ...props.modal,
}));

const searchProps = computed<Omit<PropsInputSearch, 'modelValue'>>(() => ({
  width: '100%',
  ...props.search,
}));

const rowProps = computed<Omit<PropsAppInfoRow, 'text' | 'image'>>(() => ({
  paddingX: 6,
  paddingY: 4,
  ...props.row,
}));

const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase());

const filteredItems = computed(() => {
  const query = normalizedSearchQuery.value;

  if (!query) {
    return props.items;
  }

  return props.items.filter((item) => {
    const searchValue = `${item.label} ${item.searchText ?? ''}`.trim().toLocaleLowerCase();

    return searchValue.includes(query);
  });
});

function handleModelValueUpdate(value: boolean) {
  emit('update:modelValue', value);
}

function handleTriggerClick() {
  emit('update:modelValue', true);
}

function handleSelect(item: iWidgetSearchPickerItem) {
  if (item.disabled || item.value === props.selectedValue) {
    return;
  }

  emit('select', item.value, item);
}

function resolveItemImage(item: iWidgetSearchPickerItem) {
  if (!item.image) {
    return undefined;
  }

  return {
    loading: 'lazy',
    ...item.image,
  } satisfies iAppInfoRowImage;
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      searchQuery.value = '';
    }
  },
);
</script>

<template>
  <button class="widget-search-picker__trigger app-interactive" type="button" :aria-label="triggerAriaLabel" @click="handleTriggerClick">
    <AppInfoRow :text="triggerText" :image="selectedItem?.image" size="big" :padding-x="5" :padding-y="3" />
  </button>

  <AppModal v-bind="modalProps" :model-value="modelValue" @update:model-value="handleModelValueUpdate">
    <template #header>
      <AppFlex direction="column" :gap="4" width="100%">
        <AppText
          v-if="title"
          :text="title"
          tag="span"
          font-size="lg"
          font-weight="bold"
          :uppercase="false"
          :ellipsis="true"
          :max-lines="1"
        />

        <AppInputSearch v-bind="searchProps" v-model="searchQuery" />
      </AppFlex>
    </template>

    <div class="widget-search-picker">
      <template v-if="filteredItems.length">
        <button
          v-for="item in filteredItems"
          :key="item.value"
          class="widget-search-picker__item app-interactive"
          :class="{
            'app-interactive--selected': item.value === selectedValue,
          }"
          type="button"
          :disabled="item.disabled"
          :aria-pressed="item.value === selectedValue"
          @click="handleSelect(item)"
        >
          <AppInfoRow v-bind="rowProps" :text="item.label" :image="resolveItemImage(item)" />
        </button>
      </template>

      <slot v-else name="empty">
        <AppText
          v-if="emptyText"
          class="widget-search-picker__empty"
          :text="emptyText"
          tag="span"
          color="text-tertiary"
          font-size="md"
          font-weight="medium"
          :uppercase="false"
          :ellipsis="true"
          :max-lines="2"
        />
      </slot>
    </div>
  </AppModal>
</template>

<style scoped>
.widget-search-picker__trigger {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 0;
  border: var(--app-border-width-thick) var(--app-border-style-solid) var(--app-color-border-contrast);
  border-radius: var(--app-radius-lg);
  background: var(--app-color-surface-primary);
  color: var(--app-color-text-primary);
  text-align: left;
  appearance: none;
}

.widget-search-picker {
  width: 100%;
  min-width: 0;
}

.widget-search-picker__item {
  display: block;
  width: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--app-color-text-primary);
  text-align: left;
  appearance: none;
}


.widget-search-picker__empty {
  display: block;
  padding: var(--app-padding-6);
}

</style>
