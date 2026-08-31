# Генератор иконок

## Описание

[Генератор icons assets](../../../scripts/generators/generateIconsProject.js) запускается через команду `npm run app:generate:icons-assets`.

Генератор автоматически собирает SVG-иконки проекта и формирует единый реестр доступных иконок.

Он рекурсивно сканирует директорию `src/app/assets/icons/`, подключает найденные `.svg`-файлы как raw-содержимое и генерирует типизированный объект `ICONS_ASSETS`.

## Source of truth

Источником данных для генератора является директория:

* `src/app/assets/icons/`

Генератор автоматически обрабатывает SVG-файлы во всех вложенных директориях.

Если нужно добавить, удалить или переименовать доступную иконку, сначала изменяется соответствующий `.svg`-файл в `src/app/assets/icons/`, а затем повторно запускается генератор.

## Что обновляет генератор

Генератор обновляет файл:

* `src/core/media/assets.ts`

В файл автоматически добавляются:

* imports всех найденных SVG-иконок;
* объект `ICONS_ASSETS`;
* тип `IconAssetName`.

Пример сгенерированной структуры:

```ts
export const ICONS_ASSETS = {
  'arrow-left': ArrowLeft,
  'settings': Settings,
} as const

export type IconAssetName = keyof typeof ICONS_ASSETS
```

Таким образом, `IconAssetName` всегда содержит только реально существующие в проекте иконки.

## Формирование имени иконки

Имя иконки формируется на основе относительного пути SVG-файла внутри `src/app/assets/icons/`.

Расширение `.svg` удаляется, а части пути объединяются через `-`.

Для вложенных директорий генератор также удаляет дублирование имени группы.

Например:

```text
src/app/assets/icons/navigation/arrow-left.svg
```

преобразуется в:

```text
navigation-arrow-left
```

Если имя файла уже содержит имя родительской директории:

```text
src/app/assets/icons/navigation/navigation-arrow-left.svg
```

или:

```text
src/app/assets/icons/navigation/navigation--arrow-left.svg
```

генератор исключает повторяющуюся часть имени.

## Когда использовать

Генератор нужно запускать, если:

* добавлена новая SVG-иконка в `src/app/assets/icons/`;
* удалена существующая иконка;
* изменено имя или расположение SVG-файла;
* изменена структура директорий с иконками;
* нужно восстановить `assets.ts` в актуальное состояние.

## Важное правило

Файл:

* `src/core/media/assets.ts`

не должен редактироваться вручную.

Если нужно добавить, удалить или переименовать иконку, необходимо изменить source of truth в `src/app/assets/icons/`, а затем снова запустить:

```bash
node scripts/generators/generateIconsProject.js
```
