# Форматирование кода

Форматирование кода в проекте контролируется через `Prettier`.
Актуальная конфигурация находится в [prettier.config.js](/Users/djakuzi/project/blind/prettier.config.js).

`ESLint` отвечает за ошибки кода и project-specific правила. Его конфигурация находится в [eslint.config.js](/Users/djakuzi/project/blind/eslint.config.js).

## Команды

1. Проверка форматирования запускается через `npm run format:check`.
2. Автоматическое форматирование запускается через `npm run format`.
3. Проверка ESLint запускается через `npm run lint`.
4. Автоматическое исправление поддерживаемых ESLint-правил запускается через `npm run lint:fix`.

Markdown-файлы не входят в общий Prettier-проход.

## Базовый стиль

1. Отступы - `2` пробела.
2. Табуляция для отступов не используется.
3. В `js`, `ts` и Vue script-блоках используются `;`.
4. Для строк в `js`, `ts` и Vue script-блоках используются одинарные кавычки.
5. В объектах используются пробелы внутри фигурных скобок.
6. В многострочных объектах и массивах используется trailing comma.
7. Максимальная ширина строки для автоматического форматирования - `80`.
8. В конце файла должен быть перевод строки.
9. Переводы строк нормализуются как `lf`.

## Короткие Выражения

Короткие выражения Prettier держит в одну строку:

```ts
const staticLocale = useStaticLocale(['loading'], pinia);

const isReady = computed(() => appSetupState.isReady);

languageStore.preferredLanguageCode = selectedCode;
```

Если выражение становится длинным, Prettier переносит его автоматически.
Не нужно вручную подбирать переносы для коротких initializer, assignment, object property или import.

## Vue

Vue SFC форматируются через Prettier целиком:

- `<script setup>`;
- `<template>`;
- `<style>`.

Для Vue template используется отступ в `2` пробела.

## CSS

CSS форматируется Prettier с обычным CSS-синтаксисом и `;`.

Пример:

```css
.app-card {
  display: flex;
  gap: 8px;
}
```

Пустые строки используются только для смыслового разделения блоков. Не нужно отделять каждое CSS-свойство пустой строкой.
