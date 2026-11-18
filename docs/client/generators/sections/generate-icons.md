# Генератор иконок

Собирает SVG-иконки в типизированный реестр с группами и темами для `MediaIcons`.

| | |
|---|---|
| Скрипт | [generateIconsProject.js](../../../../apps/client/scripts/generators/generateIconsProject.js) |
| Команда | `npm run app:generate:icons-assets` |
| Источник | `.svg` в `src/assets/icons/` (рекурсивно) |
| Обновляет | `src/core/media/icons/const.ts`, `type.ts` |
| Не трогает | `tool.ts`, `index.ts` — ручная часть API |

## Группа и имя

1. Первая папка внутри `src/assets/icons/` — группа. Её имя приводится к нижнему регистру.
2. Имя файла переводится в camelCase.

```text
exampleGroup/example-icon-dark.svg → группа examplegroup, ключ exampleIconDark
```

## Темы

1. Иконка с темами — пара файлов `<имя>-dark.svg` и `<имя>-light.svg`.
2. В API используется базовое имя без суффикса, тема передаётся отдельно — выбор файла скрыт внутри `MediaIcons`.

```ts
MediaIcons.getIcon('examplegroup', 'exampleIcon', 'dark');
```

## Что генерируется

| Файл | Содержимое |
|---|---|
| `const.ts` | импорты SVG и реестр `ICONS_ASSETS` по группам |
| `type.ts` | `tIconGroup`, `tIconTheme`, `tIconName<TGroup>` — выводятся из реестра |

UI не обращается к `ICONS_ASSETS` напрямую — только через `MediaIcons` из `src/core/media/icons`.

## Когда запускать

Иконка добавлена, удалена, переименована или перенесена; изменилась структура групп; нужно восстановить `const.ts` и `type.ts`.

`const.ts` и `type.ts` руками не правятся.
