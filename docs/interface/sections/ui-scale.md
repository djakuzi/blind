# Масштабирование интерфейса

Раздел описывает модель размеров UI в `blind`.

Главный принцип: у интерфейса один дизайн и одна композиция. Он не перестраивается отдельно под phone / tablet / desktop или конкретные aspect ratio. Вместо этого весь UI живёт внутри эталонного viewport и равномерно масштабируется до размера, который целиком помещается в физический viewport.

## Design reference

Текущий интерфейс был визуально настроен в браузерном viewport:

```text
2560 × 1318
```

Это и есть текущий design reference. Он выбран намеренно, чтобы внедрение новой scale-системы не изменило существующий дизайн.

На этом viewport прежняя логика давала:

```text
--app-root-font-size-base = 13.839px
```

Поэтому новая система сохраняет это значение как эталон.

## UI viewport

Физический viewport приложения и viewport интерфейса — разные понятия.

```text
physical viewport
└── UI viewport
    ├── header
    ├── views
    ├── menu
    ├── settings
    ├── HUD
    └── layout overlays
```

UI viewport всегда сохраняет пропорции reference `2560 × 1318` и целиком вписывается в физический viewport.

В `src/app/styles/tokens/scale.css`:

```css
--app-ui-viewport-width: min(100vw, 194.2336874dvh);
--app-ui-viewport-height: min(100dvh, 51.484375vw);
```

Если физический viewport шире reference ratio, UI ограничивается высотой. Если он уже reference ratio, UI ограничивается шириной.

Дополнительное пространство не меняет композицию UI. Его может использовать фон или игровая сцена.

## Базовый масштаб

Размер интерфейса определяется одним uniform scale. Отдельного `scaleX` и `scaleY` у UI нет.

```text
width scale ─┐
             ├── limiting scale
height scale ┘
             ↓
root font size
             ↓
rem
             ↓
design tokens
             ↓
components
```

В CSS это выражено через две эквивалентные reference-зависимости:

```css
--app-root-font-size-base: min(0.5405859375vw, 1.05dvh);
```

На reference viewport `2560 × 1318`:

```text
0.5405859375vw = 13.839px
1.05dvh        = 13.839px
```

Поэтому существующий дизайн на reference viewport остаётся прежним.

## UI Scale

`--app-scale` — пользовательская настройка размера интерфейса:

```text
small   = 0.9
default = 1
large   = 1.1
```

Она применяется поверх viewport scale только один раз:

```css
--app-root-font-size: calc(
  var(--app-root-font-size-base) * var(--app-scale)
);
```

Например при текущем `small = 0.9` на reference viewport:

```text
13.839px × 0.9 = 12.4551px
```

Это совпадает с прежним значением root font size.

UI scale не используется для определения типа устройства и не должен повторно применяться внутри токенов или компонентов.

## Design tokens

Размеры UI задаются через `rem` и project tokens:

```css
.component {
  gap: var(--app-space-4);
  font-size: var(--app-font-size-md);
  border-radius: var(--app-radius-md);
}
```

Так как `rem` зависит от единого viewport scale, размеры текста, controls, spacing, radius и остальных элементов изменяются синхронно.

Произвольные отдельные коэффициенты масштаба внутри компонентов не нужны.

## Aspect ratio

Для UI не создаются отдельные layout-режимы:

```text
4:3
16:10
16:9
21:9
32:9
```

Любой физический viewport обрабатывается одной и той же математикой.

На более квадратном экране UI вписывается по ширине и вокруг него появляется дополнительное вертикальное пространство.

На ultrawide UI вписывается по высоте и дополнительное пространство появляется по горизонтали.

Композиция самого UI при этом не перестраивается.

## Background и game viewport

Фон и игровая сцена не обязаны быть ограничены UI viewport.

```text
physical viewport
├── background / game scene → весь экран
└── UI viewport            → reference ratio
```

Поэтому дополнительная область на 4:3, ultrawide или fullscreen desktop может использоваться сценой без изменения расположения интерфейса.

## Safe Area

Safe area остаётся отдельной системой и защищает UI от notch, скруглений экрана, home indicator и других системных зон.

Компоненты должны использовать project tokens:

```css
var(--app-safe-area-top)
var(--app-safe-area-right)
var(--app-safe-area-bottom)
var(--app-safe-area-left)
```

Прямое использование `env(safe-area-inset-*)` внутри компонентов нежелательно.

## UI Scale и Render Scale

UI scale и качество рендера игры — независимые системы.

UI scale влияет на:

- меню;
- настройки;
- HUD;
- кнопки;
- текст;
- overlays.

Render scale управляет canvas / Three.js renderer и не должен влиять на CSS UI tokens.

## Базовые правила

1. У интерфейса один design reference: `2560 × 1318`.
2. UI viewport всегда сохраняет reference aspect ratio.
3. Весь UI использует один uniform viewport scale.
4. Независимые `scaleX` и `scaleY` для интерфейса запрещены.
5. Пользовательский `--app-scale` применяется один раз поверх viewport scale.
6. Размеры компонентов по возможности задаются через `rem` и project tokens.
7. Aspect ratio физического экрана не меняет композицию UI.
8. Фон и игровая сцена могут использовать весь physical viewport.
9. Safe area и render scale остаются отдельными системами.
