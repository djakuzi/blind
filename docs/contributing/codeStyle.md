# Code Style

Правила стиля кода в `blind`.

## 1. Именование директорий

1. Директории пишутся в `camelCase`.
2. Имена директорий отражают функциональную область или модуль.

Примеры:

- `app`
- `shared`
- `orderGlasses`
- `ui`
- `api`

## 2. Именование файлов

1. Файлы пишутся в `camelCase`.
2. Vue-компоненты обычно пишутся в `PascalCase`.

Типичные суффиксы файлов:

- `.vue` - Vue-компоненты;
- `.ts` - логика, типы, сторы, утилиты;
- `.service.ts` - сервисы;
- `.store.ts` - Pinia store;
- `.types.ts` - типы;
- `.constants.ts` или `.const.ts` - константы;
- `.actions.ts` или папка `actions/` - действия;
- `.model.ts` - модели.

Примеры:

- `OrderSummary.vue`
- `loadFirstPage.ts`
- `api.service.ts`
- `navigation.ts`
- `User.ts`

## 3. Константы

1. Константы пишутся в `UPPER_SNAKE_CASE`.
2. Для объектных словарей часто используется `as const`.
3. Типы на основе словарей выводятся через `keyof typeof`.

Примеры:

```ts
export const TAB_KEYS = {
  home: 'home',
  catalog: 'catalog',
} as const

export type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS]
```

## 4. Переменные и функции

1. Переменные и функции пишутся в `camelCase`.
2. Функции-обработчики часто начинаются с `handle`.
3. Фабрики и action-creator функции часто начинаются с `create`.
4. Composable-функции начинаются с `use`.
5. Булевы значения обычно имеют префиксы `is`, `has`, `can`, `should`.

Примеры:

- `handleBack`
- `createShowToast`
- `useProfileOrders`
- `isSuccess`
- `hasBirthday`
- `canSubmitOrder`

## 5. Типы, интерфейсы и классы

1. `type`, `interface` и `class` пишутся в `PascalCase`.
2. Интерфейсы описывают форму данных или props.
3. Типы используются для union-типов, алиасов и выводимых типов.
4. Классы используются для доменных моделей и сервисов.

Примеры:

- `interface Props`
- `interface OrderGlassesState`
- `type LoadState`
- `class User`
- `class Salon`

## 6. Vue-компоненты

1. Используется `<script setup lang="ts">`.
2. Props описываются через `interface Props`.
3. Значения по умолчанию задаются через `withDefaults`.
4. События описываются через `defineEmits`.
5. Импорты типов пишутся через `import type`.

Пример:

```vue
<script setup lang="ts">
interface Props {
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})
</script>
```

## 7. Стили

1. CSS-классы пишутся в `kebab-case`.
2. Для компонентов используется BEM-подход.
3. Для токенов и переиспользуемых значений применяются CSS variables.
4. Префикс переменных проекта - `--app-`.

Примеры:

- `.app-header`
- `.app-header__top-row`
- `.app-header--with-bottom`
- `--app-icon-size`
- `--space-10`

