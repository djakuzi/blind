# Генератор иконок

## Описание

[Генератор иконок](../../../scripts/generators/generateIconsProject.js) запускается через команду:

```bash
npm run app:generate:icons-assets
```

Генератор рекурсивно собирает SVG-иконки проекта, импортирует их как raw SVG и формирует generated registry и типы для `MediaIcons`.

## Source of truth

Источником данных является:

- `src/assets/icons/`

Генератор обрабатывает `.svg`-файлы во вложенных директориях.

Если иконка добавлена, удалена, переименована или перенесена, сначала изменяется содержимое `src/assets/icons/`, затем повторно запускается генератор.

## Что обновляет генератор

Генератор обновляет только:

- `src/core/media/icons/const.ts`
- `src/core/media/icons/type.ts`

`src/core/media/icons/tool.ts` и `src/core/media/icons/index.ts` являются ручной частью API и генератором не перезаписываются.

### `const.ts`

Содержит imports SVG и generated registry:

```ts
export const ICONS_ASSETS = {
  back: {
    backArrowDark: BackArrowDark,
    backArrowLight: BackArrowLight,
  },
  logo: {
    blindDark: BlindDark,
    blindLight: BlindLight,
  },
} as const;
```

### `type.ts`

Содержит типы, вычисленные из registry:

```ts
export type tIconGroup = keyof typeof ICONS_ASSETS;
export type tIconTheme = 'light' | 'dark';
export type tIconName<TGroup extends tIconGroup> = ...;
```

## Формирование group и icon name

Первый сегмент пути внутри `src/assets/icons/` становится группой.

Например:

```text
src/assets/icons/back/back-arrow-dark.svg
```

формирует:

```text
group: back
icon asset: backArrowDark
```

Имена директорий и файлов преобразуются в camelCase.

Пример:

```text
src/assets/icons/connectionType/bluetooth-dark.svg
```

попадает в группу:

```text
connectiontype
```

с ключом:

```text
bluetoothDark
```

## Themed icons

Для themed-иконок используется соглашение суффиксов:

```text
<name>-dark.svg
<name>-light.svg
```

Например:

```text
blind-dark.svg
blind-light.svg
```

На уровне публичного API используется базовое имя без theme-суффикса:

```ts
MediaIcons.getIcon('logo', 'blind', 'dark');
MediaIcons.getIcon('logo', 'blind', 'light');
```

Разрешение `Dark` / `Light` скрыто внутри `MediaIcons`. UI-компоненты не должны обращаться к `ICONS_ASSETS` напрямую.

## Публичный API

Точка входа:

- `src/core/media/icons/index.ts`

Использование:

```ts
import { MediaIcons } from '@/core/media/icons';

const icon = MediaIcons.getIcon('back', 'backArrow', 'dark');
```

## Когда использовать

Генератор нужно запускать, если:

- добавлена новая SVG-иконка;
- удалена существующая иконка;
- изменено имя SVG-файла;
- изменено расположение иконки;
- изменилась структура групп внутри `src/assets/icons/`;
- нужно восстановить generated `const.ts` и `type.ts`.

## Важное правило

Generated-файлы:

- `src/core/media/icons/const.ts`
- `src/core/media/icons/type.ts`

не редактируются вручную.

Для изменения доступных иконок нужно изменить source of truth в `src/assets/icons/` и запустить:

```bash
npm run app:generate:icons-assets
```
