# Code Style

Именование и общие правила написания кода.

## Именование

| Что | Стиль | Пример |
|---|---|---|
| Директория | `camelCase`, по функциональной области | `shared`, `matchSetup` |
| Файл | `camelCase` | `loadData.ts` |
| Vue-компонент | `PascalCase` с префиксом слоя | `AppExample.vue` |
| Константа | `UPPER_SNAKE_CASE` | `EXAMPLE_KEYS` |
| Переменная, функция | `camelCase` | `selectedItem` |
| `interface` | `PascalCase` с префиксом `i` | `iExampleItem` |
| `type` | `PascalCase` с префиксом `t` | `tExampleState` |
| Props компонента | `Props<ИмяКомпонента>` | `PropsAppExample` |
| Общий фрагмент props | `Props<Смысл>` | `PropsWidth` |
| Модель, сервис (`class`) | смысловой префикс | `ModelExample`, `ServiceExample` |

### Суффиксы файлов

| Суффикс | Содержимое |
|---|---|
| `.vue` | Vue-компонент |
| `.ts` | логика, утилиты |
| `.types.ts` | типы |
| `.const.ts`, `.constants.ts` | константы |
| `.store.ts` | Pinia store |
| `.service.ts` | сервис |
| `.model.ts` | модель |
| `.actions.ts` или папка `actions/` | действия |

### Префиксы Vue-компонентов

| Префикс | Компонент |
|---|---|
| `View` | экран (route) |
| `Layout` | каркас экрана |
| `Widget` | сценарный блок |
| `Ui` | UI-компонент feature |
| `App` | общий переиспользуемый компонент, где бы он ни лежал |

### Функции и переменные

| Префикс | Назначение |
|---|---|
| `handle` | обработчик события |
| `create` | фабрика |
| `use` | composable |
| `is`, `has`, `can`, `should` | булево значение |
| `get` | получение значения |
| `set`, `update` | изменение значения |

1. Асинхронные функции называются по смыслу действия, без префикса `async`.
2. Имя отражает роль значения, а не его тип: `selectedItem`, а не `data`.

## Константы-словари

Словарь объявляется через `as const`, тип выводится через `keyof typeof`.

```ts
export const EXAMPLE_KEYS = {
  first: 'first',
  second: 'second',
} as const;

export type tExampleKey = (typeof EXAMPLE_KEYS)[keyof typeof EXAMPLE_KEYS];
```

## Типы

1. `interface` — форма данных и props. `type` — union, алиасы, выводимые типы.
2. `class` — доменные модели и сервисы.
3. Тип, нужный только одному компоненту, остаётся в его файле.

## Vue-компоненты

1. `<script setup lang="ts">`.
2. Props — через `interface Props<ИмяКомпонента>`, умолчания — через `withDefaults`. Подробно — [Props компонентов](./componentProps.md).
3. События — через `defineEmits`.
4. Типы импортируются через `import type`.

## Импорты

1. Для файлов из `src` используется алиас `@`.
2. Без длинных относительных путей.
3. Без неиспользуемых импортов.
