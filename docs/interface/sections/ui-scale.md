# Масштабирование интерфейса

Раздел описывает базовую модель размеров UI в `blind`.

Главный принцип: интерфейс адаптируется под доступное пространство экрана, а не под конкретные устройства. Масштабирование строится на `rem`, CSS variables и пользовательском `UI scale`.

## Базовая модель

Основная точка масштабирования:

```css
:root {
  --app-scale: 1;
  --app-root-font-size-base: 1vmin;
  --app-root-font-size: calc(
    var(--app-root-font-size-base) * var(--app-scale)
  );
}
```

В `src/app/styles/core/root.css`:

```css
:root {
  font-size: var(--app-root-font-size);
}
```

После этого все размеры в `rem` автоматически зависят от viewport и пользовательского масштаба.

```text
viewport
↓
--app-root-font-size-base
↓
--app-scale
↓
--app-root-font-size
↓
rem
↓
design tokens
↓
components
```

## Базовый размер UI

`--app-root-font-size-base` задаёт базовую UI-единицу и зависит от viewport.

При необходимости она меняется через media queries:

```css
@media (min-aspect-ratio: 16 / 9) {
  :root {
    --app-root-font-size-base: 1vmin;
  }
}
```

Так как игра рассчитана на горизонтальную ориентацию, responsive-логика должна учитывать:

* ширину и высоту viewport;
* aspect ratio;
* landscape-сценарии;
* safe area;
* способ ввода, если он влияет на hit area.

Не следует строить систему вокруг `phone / tablet / desktop`. Лучше использовать режимы доступного пространства:

* compact landscape;
* regular landscape;
* wide;
* ultrawide.

## UI Scale

`--app-scale` — пользовательская настройка масштаба интерфейса:

```text
Interface scale: 90% / 100% / 110% / 120%
```

Она не должна использоваться для определения типа устройства.

```text
mobile = 0.8
tablet = 1
desktop = 1.3
```

Размер viewport и пользовательский UI scale — разные задачи.

`--app-scale` применяется только внутри:

```css
--app-root-font-size: calc(
  var(--app-root-font-size-base) * var(--app-scale)
);
```

В остальных токенах повторно умножать значения на `--app-scale` нельзя, иначе масштаб применится дважды.

## Design Tokens

Размеры UI задаются через `rem`:

```css
:root {
  --app-space-4: 1rem;
  --app-padding-4: 1rem;
  --app-font-size-md: 1rem;
  --app-radius-md: 0.5rem;
}
```

Компоненты используют токены вместо произвольных размеров:

```css
.component {
  gap: var(--app-space-4);
  font-size: var(--app-font-size-md);
  border-radius: var(--app-radius-md);
}
```

Для повторяемых UI-сущностей поверх primitive tokens добавляются semantic tokens:

```css
:root {
  --app-layout-screen-padding: var(--app-space-6);
  --app-control-height-md: var(--app-space-14);
  --app-panel-width-md: 30rem;
}
```

Primitive tokens задают шкалу значений, semantic tokens — их роль в интерфейсе.

## Responsive Layout

Визуальная адаптация должна выполняться в CSS:

* `clamp()`;
* `min()`;
* `max()`;
* media queries;
* container queries.

Не следует использовать JS только для изменения раскладки:

```ts
const isMobile = window.innerWidth < 768;
```

JS нужен только тогда, когда размер экрана меняет поведение приложения, а не только внешний вид.

Breakpoints выбираются по моменту, когда ломается композиция, а не по названию устройства.

## Safe Area

Safe area защищает UI от notch, скруглений экрана, home indicator и других системных зон.

```css
:root {
  --app-safe-area-top: calc(env(safe-area-inset-top, 0px) + 1rem);
  --app-safe-area-right: calc(env(safe-area-inset-right, 0px) + 1rem);
  --app-safe-area-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
  --app-safe-area-left: calc(env(safe-area-inset-left, 0px) + 1rem);
}
```

`env(safe-area-inset-*)` уже содержит готовую CSS-длину и не масштабируется через `--app-scale`. Дополнительный `rem` задаёт внутренний отступ интерфейса.

Компоненты должны использовать project tokens:

```css
.screen {
  padding:
    var(--app-safe-area-vertical)
    var(--app-safe-area-horizontal);
}
```

Прямое использование `env(safe-area-inset-*)` внутри компонентов нежелательно.

## UI Scale и Render Scale

Масштаб UI и качество рендера игры — независимые системы.

`--app-scale` влияет только на интерфейс:

* меню;
* настройки;
* HUD;
* кнопки;
* текст;
* overlay.

Он не должен влиять на canvas или Three.js renderer.

Настройка качества рендера должна существовать отдельно:

```text
Render scale: 50% / 75% / 100%
```

Она управляет renderer/canvas, а не CSS UI tokens.

## Базовые правила

1. Размеры UI по возможности задаются через `rem` и CSS variables.
2. `--app-scale` применяется один раз — внутри `--app-root-font-size`.
3. UI scale не смешивается с responsive-логикой и render scale.
4. Визуальная адаптация выполняется через CSS, а не через `isMobile` в JS.
5. Breakpoints определяются по композиции интерфейса.
6. Safe area используется через project tokens.
7. Основные layout-режимы игры проектируются вокруг landscape viewport.