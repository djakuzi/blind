# Генератор аудио

## Описание

[Генератор аудио](../../../scripts/generators/generateAudioProject.js) запускается через команду:

```bash
npm run app:generate:audio-assets
```

Генератор рекурсивно собирает аудиофайлы проекта и формирует типизированный registry, ID и группы для `MediaAudio`.

## Source of truth

Источником данных является:

- `src/assets/audio/`

Поддерживаемые форматы:

- `.mp3`
- `.wav`

Аудиофайл должен находиться внутри одной из верхнеуровневых директорий:

- `sfx/`
- `music/`

Файлы других типов, например `*.license.md`, генератор не включает в audio registry.

## Что обновляет генератор

Генератор обновляет только:

- `src/core/media/audio/const.ts`
- `src/core/media/audio/type.ts`

`src/core/media/audio/tool.ts` и `src/core/media/audio/index.ts` являются ручной частью API и генератором не перезаписываются.

### `const.ts`

Содержит imports, `AUDIO_ASSETS` и `AUDIO_GROUPS`.

Пример:

```ts
export const AUDIO_ASSETS = {
  'sfx.interaction.hold-complete': {
    id: 'sfx.interaction.hold-complete',
    src: AudioAsset1,
    type: 'sfx',
  },
} as const;

export const AUDIO_GROUPS = {
  sfx: [
    'sfx.interaction.hold-complete',
  ],
  'sfx.interaction': [
    'sfx.interaction.hold-complete',
  ],
} as const;
```

### `type.ts`

Типы вычисляются из generated registry:

```ts
export type tAudioId = keyof typeof AUDIO_ASSETS;
export type tAudioGroupId = keyof typeof AUDIO_GROUPS;
export type tAudioType = 'sfx' | 'music';
```

## Формирование audio ID

ID строится из относительного пути к файлу:

1. расширение удаляется;
2. разделители директорий заменяются на точки.

Например:

```text
src/assets/audio/sfx/interaction/hold-complete.wav
```

превращается в:

```text
sfx.interaction.hold-complete
```

Если два файла создают одинаковый ID, генератор завершается с ошибкой.

## Формирование групп

Для каждой директории автоматически создается группа, включающая все аудиофайлы внутри нее рекурсивно.

Для:

```text
sfx/
├── interaction/
│   ├── hold-complete.wav
│   └── click.wav
└── game/
    └── shot.wav
```

будут доступны, среди прочих:

```text
sfx
sfx.interaction
sfx.game
```

Группа `sfx` содержит все SFX из вложенных директорий, а `sfx.interaction` - только ресурсы своей ветки.

## Публичный API

Generated registry скрыт за `MediaAudio`:

```ts
import { MediaAudio } from '@/core/media/audio';

MediaAudio.getAudio('sfx.interaction.hold-complete');
MediaAudio.getAudioGroup('sfx.interaction');
```

В обычном Vue-компоненте playback должен выполняться через `useAudio` по `tAudioId`, а не через ручной вызов `MediaAudio.getAudio(...)`.

Например:

```ts
const { play } = useAudio();

play('sfx.interaction.hold-complete');
```

`MediaAudio.getAudioGroup(...)` используется там, где нужен набор ресурсов, например для preload.

## Preload

`ToolAudio.preload` принимает один ресурс или массив ресурсов.

Preload сделан идемпотентным: повторный запрос одного и того же `assetId` не должен повторно загружать уже загруженный ресурс, а параллельные запросы одного ресурса используют общий активный preload request.

Пример:

```ts
await ToolAudio.preload(
  MediaAudio.getAudioGroup('sfx.interaction'),
);
```

Какие именно группы preload'ить на старте или перед конкретным сценарием, определяется кодом приложения, а не генератором.

## Лицензии и provenance

Правила учета лицензий аудио находятся в:

- `src/assets/audio/LICENSES.md`

Внешние или AI-generated аудиофайлы могут иметь sidecar-файл вида:

```text
hold-complete.wav
hold-complete.license.md
```

Такие `.md`-файлы не участвуют в генерации audio registry.

## Когда использовать

Генератор нужно запускать, если:

- добавлен аудиофайл;
- удален аудиофайл;
- изменено имя аудиофайла;
- изменено расположение аудиофайла;
- изменена структура audio-директорий;
- нужно восстановить generated `const.ts` и `type.ts`.

## Важное правило

Generated-файлы:

- `src/core/media/audio/const.ts`
- `src/core/media/audio/type.ts`

не редактируются вручную, **кроме поля `volume`** в `const.ts`. Генератор сохраняет вручную заданную громкость существующего audio ID при повторном запуске.

Для изменения структуры audio registry нужно изменить source of truth в `src/assets/audio/` и запустить:

```bash
npm run app:generate:audio-assets
```
