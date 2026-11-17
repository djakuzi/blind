# Ассеты в проекте Blind

Это наблюдаемые соглашения проекта. Если найдёшь расхождение с кодом или `docs/`, сообщи пользователю, не выбирай молча.

## Иконки

- Source of truth: `src/assets/icons/<group>/`.
- Первая папка — группа; имена в kebab-case, генератор переводит в camelCase (`connectionType/bluetooth-dark.svg` → группа `connectiontype`, ключ `bluetoothDark`).
- Тема — парой файлов:
  - `<name>-dark.svg` — для **тёмной темы** (светлая заливка, сейчас `#f7f7f8`);
  - `<name>-light.svg` — для **светлой темы** (тёмная заливка, сейчас `#111114`).
  Эти значения совпадают с `--app-color-icon-primary: light-dark(#111114, #f7f7f8)` в `tokens/colors.css`. Берёшь другой цвет — сначала найди его в palette tokens.
- Пары `-dark`/`-light` должны совпадать по геометрии — отличаются только цвета.
- `currentColor` в иконках проекта не используется: цвет зашит в файл, тему выбирает `MediaIcons` по `resolvedThemeMode`.
- После добавления, удаления, переименования или переноса — `npm run app:generate:icons-assets`. `src/core/media/icons/const.ts` и `type.ts` — generated, руками не править.
- В UI: `AppIcon` (`src/app/shared/components/elements/media/AppIcon.vue`) → `MediaIcons.getIcon(group, icon, theme)`. Прямой импорт `ICONS_ASSETS` в UI запрещён.
- Подробно: `docs/generators/sections/generate-icons.md`.

## Inline-вставка и id

`AppIcon` вставляет SVG inline через `v-html`. Поэтому:

- Все `id` (градиенты, clipPath, mask, filter) уникальны в пределах всей страницы — используй префикс по имени иконки: `online-dark-glow`, а не `glow`.
- Никаких `<script>`, `on*`-атрибутов, внешних ссылок и `<foreignObject>`.
- Размер задаёт контейнер: `width`/`height` на корневом `<svg>` допустимы, но решающим является `viewBox`.

## viewBox

Единой сетки 24×24 в проекте нет:

- Иконки подключения (`connectionType`) — `0 0 128 128`.
- Иконки в шапке (`back`, `settings`) — viewBox обрезан по видимым границам (см. коммиты «Tighten header icon viewBoxes», «trim back arrow SVG viewBox to visible bounds»), чтобы выравнивание в кнопках было точным.

Правило: перед созданием иконки посмотри соседей в той же группе и держи их viewBox, вес линий и поля.

## Старые версии

В `connectionType` встречаются файлы с префиксом `old-` — сохранённые прежние варианты. Если заменяешь утверждённую иконку, спроси пользователя, сохранять ли старую версию так же. Не удаляй `old-` файлы без запроса. Учти: генератор регистрирует и их.

## Курсоры

См. `references/cursors.md`.

## Изображения

- Растровые изображения — `src/assets/images/<group>/`, предпочтителен `webp` (рядом лежат `png`-исходники фонов).
- Растр не выдаётся за вектор. Для SVG-запроса — настоящий векторный исходник.
