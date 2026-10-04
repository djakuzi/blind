# Интерфейс

Раздел описывает правила построения интерфейса `blind`: масштабирование, единицы измерения, адаптацию под viewport, safe area, локализацию, UI-аудио и общие UI-соглашения.

## Разделы

- [Масштабирование интерфейса](./sections/ui-scale.md)
- [Локализация интерфейса](./sections/localization.md)

## Аудио интерфейса

Vue-компоненты и composables app-слоя не должны напрямую работать с native audio SDK.

Основной путь одноразового или loop playback из Vue:

```text
component / composable
        ↓
useAudio
        ↓
MediaAudio
        ↓
ToolAudio
        ↓
NativeAudio
```

Компонент передает типизированный `tAudioId`:

```ts
const { play } = useAudio();

play('sfx.interaction.hold-complete');
```

`useAudio` самостоятельно резолвит ID через `MediaAudio` и вызывает `ToolAudio`.

Для компонентов, которые позволяют настраивать звук через props, следует передавать `tAudioId | null`, а не готовый `iAudioResource`.

Пример:

```ts
sound?: tAudioId | null;
```

`null` используется, если звук для конкретного экземпляра компонента нужно явно отключить.

Глобальное состояние `soundEnabled` синхронизируется с `ToolAudio.setMuted(...)` через audio setup. Store не должен напрямую управлять `ToolAudio`.

Preload глобально нужных SFX выполняется setup-слоем через группы `MediaAudio`. Не следует автоматически preload'ить весь audio registry только потому, что ресурс существует в проекте.
