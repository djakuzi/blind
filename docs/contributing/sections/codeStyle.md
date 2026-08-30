# Code Style

Правила стиля кода в `blind`.

## 1. Именование директорий

1. Директории пишутся в `camelCase`.
2. Имена директорий отражают функциональную область или модуль.

Примеры:

- `app`
- `shared`
- `ui`

## 2. Именование файлов

1. Файлы пишутся в `camelCase`.
2. Vue-компоненты обычно пишутся в `PascalCase`.
3. Правила с префиксами `View`, `Layout`, `Widget`, `Ui` и `App` относятся именно к файлам Vue-компонентов.

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

- `ViewUser.vue`
- `LayoutMain.vue`
- `WidgetUser.vue`
- `UiUser.vue`
- `AppModal.vue`
- `loadFirstPage.ts`
- `api.service.ts`
- `User.model.ts`

Примеры именования сущностей с префиксом:

- `ViewUser.vue`
- `LayoutMain.vue`
- `WidgetUser.vue`
- `UiUser.vue`
- `AppTitle.vue`
- `AppModal.vue`
- `ModelUser`
- `ServiceUser`

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
6. Функции получения данных или состояния могут начинаться с `get`.
7. Функции установки или обновления значения могут начинаться с `set` или `update`.
8. Асинхронные функции именуются по смыслу действия и не требуют специального префикса вроде `async`.
9. Название переменной должно отражать ее роль, а не быть слишком общим.

Примеры:

- `handleBack`
- `createShowToast`
- `useProfileOrders`
- `isSuccess`
- `hasBirthday`
- `canSubmitOrder`
- `getCurrentUser`
- `setThemeMode`
- `updateProfile`
- `fetchGameSession`
- `selectedLevel`
- `currentRouteName`

## 5. Типы, интерфейсы и классы

1. `type`, `interface` и `class` пишутся в `PascalCase`.
2. Для `interface` в начале имени используется префикс `i`.
3. Для `type` в начале имени используется префикс `t`.
4. Исключение для props компонента - используется имя `Props`.
5. Интерфейсы описывают форму данных или props.
6. Типы используются для union-типов, алиасов и выводимых типов.
7. Классы используются для доменных моделей и сервисов.
8. Если сущность является моделью или сервисом, в ее имени используется смысловой префикс.
9. Локальные интерфейсы, нужные только одному компоненту или экрану, можно оставлять рядом с ним.

Примеры:

- `interface Props`
- `interface iUserActions`
- `interface iUserAddress`
- `type tLoadState`
- `type tKeyActionUser`
- `class ModelUser`
- `class ServiceUser`

## 6. Vue-компоненты

1. Используется `<script setup lang="ts">`.
2. Props описываются через `interface Props`.
3. Значения по умолчанию задаются через `withDefaults`.
4. События описываются через `defineEmits`.
5. Импорты типов пишутся через `import type`.
6. Экраны приложения именуются с префиксом `View`.
7. Layout-компоненты именуются с префиксом `Layout`.
8. UI-компоненты именуются с префиксом `Ui`.
9. Widget-компоненты именуются с префиксом `Widget`.
10. Общие переиспользуемые компоненты именуются с префиксом `App` независимо от того, лежат ли они в `ui`, `widget` или в другой общей директории.
11. Если интерфейсы нужны только конкретной вью или компоненту, они остаются рядом с ним в этом же файле.

Пример:

```vue
<script setup lang="ts">
interface iUserActions {
  openProfile: () => void
}

interface Props {
  actions: iUserActions
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
5. Если CSS-класс является общим для проекта, он начинается с префикса `app-`.
6. Если CSS variable является локальной переменной конкретного компонента, она начинается с префикса `--cp-`.
7. Для написания вложенных селекторов в проекте используется CSS Nesting.

Примеры:

- `.app-header`
- `.app-flex`
- `.app-header__top-row`
- `.app-header--with-bottom`
- `--app-icon-size`
- `--cp-card-offset`

Пример CSS Nesting:

```css
.app-card {
  display: flex;
  gap: var(--app-spacing-8);

  &__title {
    color: var(--app-color-text-primary);
  }

  &--active {
    background: var(--app-color-surface-interactive);
  }
}
```

## Импорты

1. Для файлов из `src` следует использовать алиас `@`, если он уместен в текущем файле.
2. Не создавать длинные и хрупкие относительные импорты без необходимости.
3. Не оставлять неиспользуемые импорты.

## Форматирование кода

Стиль кода контролируется через `ESLint`. Актуальная конфигурация находится в [eslint.config.js](/Users/djakuzi/project/blind/eslint.config.js).

1. Для `js`, `ts` и `<script setup lang="ts">` используется отступ в `2` пробела.
2. В `js`, `ts` и Vue script-блоках используются `;`.
3. Для строк в `js`, `ts` и Vue script-блоках используются одинарные кавычки.
4. В объектах используются пробелы внутри фигурных скобок.
5. Для многострочных объектов, массивов и списков аргументов используется trailing comma.
6. Не допускаются хвостовые пробелы и лишние пустые строки.
7. Для Vue template используется отступ в `2` пробела.
8. Для CSS сохраняется обычный CSS-синтаксис с `;`.

Пример:

```ts
const config = {
  title: 'blind',
  enabled: true,
}
```
