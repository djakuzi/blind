# CSS Style

Раздел описывает правила написания CSS в `blind`: именование, design tokens, локальные переменные компонентов, contracts, responsive-подход и устройство `src/app/styles`.

## Общий Принцип

CSS в проекте делится на два уровня:

1. Глобальная визуальная система в `src/app/styles`.
2. Локальные стили компонентов через `<style scoped>`.

Глобальный CSS отвечает за tokens, reset, fonts, root и базовое поведение страницы.

Компонентный CSS отвечает за конкретную раскладку компонента, его состояния и локальные CSS variables.

## Именование CSS

1. CSS-классы пишутся в `kebab-case`.
2. Для компонентов используется BEM-подход.
3. Общие проектные классы начинаются с префикса `app-`.
4. Глобальные CSS variables начинаются с префикса `--app-`.
5. Локальные CSS variables конкретного компонента начинаются с префикса `--cp-`.
6. Для вложенных селекторов используется CSS Nesting.

Примеры формата:

- `.app-header`
- `.app-flex`
- `.app-header__top-row`
- `.app-header--with-bottom`
- `--app-icon-size`
- `--cp-card-offset`

Пример BEM и nesting:

```css
.app-card {
  display: flex;
  gap: var(--app-space-4);

  &__title {
    color: var(--app-color-text-primary);
  }

  &--active {
    background: var(--app-color-surface-interactive);
  }
}
```

## Глобальная Структура

Глобальные app-стили находятся в:

```text
src/app/styles
```

Назначение:

- `index.css` - единая точка подключения app-стилей.
- `core/*` - базовые правила страницы: fonts, reset, body, root.
- `tokens/*` - CSS variables дизайн-системы.
- `contracts/*` - TypeScript-доступ к style tokens.
- `utilities/*` - глобальные utility-классы, если они действительно нужны.

## Порядок Подключения

`src/app/styles/index.css` задает общий порядок подключения CSS-слоев.

Порядок важен:

1. `fonts.css` регистрирует шрифты.
2. `reset.css` сбрасывает браузерные дефолты.
3. `tokens/*` объявляют CSS variables визуальной системы.
4. `base.css` применяет базовый фон, font-family и browser text settings.
5. `root.css` применяет итоговый `font-size` для `:root`.

`root.css` подключается после tokens, потому что использует `--app-root-font-size`.

Если в `tokens` добавляется новый файл, его нужно подключать в блоке tokens. Если добавляется новый `core`-файл, его место выбирается по зависимости: сначала нейтральная подготовка страницы, затем применение app-level правил.

## Core Styles

`core` содержит правила, которые относятся ко всей странице.

### `fonts.css`

Регистрирует font assets через `@font-face`.

Файл отвечает только за подключение шрифтов. Назначение базового шрифта на `body` должно оставаться в `base.css`.

### `reset.css`

Сбрасывает браузерные стили:

- `box-sizing`;
- margin и padding;
- базовое поведение media elements;
- стили `input`, `button`, `textarea`, `select`, `a`;
- списки, таблицы и ссылки.

Reset должен быть нейтральным. Не нужно добавлять туда цвета, размеры интерфейса или стили конкретных компонентов.

### `base.css`

Отвечает за базовое состояние приложения:

- размеры `html`, `body`, `#app`;
- фон приложения;
- базовый `font-family`;
- font smoothing;
- `text-size-adjust`.

`base.css` может использовать готовые tokens, но не должен объявлять новые шкалы spacing, colors, typography или z-index.

### `root.css`

Применяет главную точку масштабирования:

Этот файл должен оставаться маленьким. Его задача - связать CSS root с вычисленным размером интерфейсной единицы.

## Design Tokens

`tokens` - это глобальные CSS variables приложения.

Они описывают повторяемые значения визуальной системы:

- `scale.css` - UI scale и root font size;
- `colors.css` - colors, semantic colors и theme values;
- `spacing.css` - расстояния между элементами;
- `padding.css` - внутренние отступы;
- `typography.css` - font-size, font-weight, line-height, letter-spacing;
- `radius.css` - радиусы;
- `borders.css` - ширина и стиль границ;
- `layer.css` - z-index уровни;
- `safearea.css` - safe area отступы.

Компоненты должны брать значения из tokens: spacing, colors, typography, radius, borders, layers и safe area.

Не нужно писать произвольные значения, если для них уже есть token.

Правила масштабирования UI описаны в разделе [Масштабирование интерфейса](../../interface/sections/ui-scale.md). В CSS style-правилах важно только одно: обычные tokens не должны повторно умножаться на `--app-scale`.

## Safe Area

Safe area задается через project tokens:

```text
platform safe area
↓
project safe-area tokens
↓
component padding / offset
```

Компоненты должны использовать `--app-safe-area-*`, а не прямой `env(safe-area-inset-*)`.

`env(safe-area-inset-*)` уже приходит как готовая CSS-длина от браузера или WebView, поэтому его нужно передавать в project tokens без дополнительного пересчета.

## Theme And Colors

Цвета живут в `tokens/colors.css`.

Компонент должен использовать semantic tokens, а не напрямую собирать light/dark colors внутри своего scoped CSS.

Компонент не должен самостоятельно описывать light/dark значения. Для этого используются tokens и `light-dark()`.

Если цвета для состояния не хватает, сначала нужно добавить semantic token в `colors.css`, а потом использовать его в компоненте.

## TypeScript Contracts

`contracts` нужны там, где style token приходит в компонент через props.

Например, компонент может принять короткое token-значение через prop, а contract преобразует его в CSS variable.

Типичный contract содержит:

- список допустимых tokens;
- type для token;
- type для входного значения;
- функцию проверки token;
- функцию получения CSS variable;
- `resolve*Value`, которая превращает token в CSS variable.

Если contract auto-generated, его нельзя редактировать вручную. Нужно менять source token в `tokens/*` и запускать generator.

## Component Styles

Vue-компоненты пишут локальную раскладку через `<style scoped>`.

Локальные стили отвечают за:

- display и layout;
- состояния компонента;
- BEM modifiers;
- локальные CSS custom properties;
- привязку props к CSS через `v-bind()`.

Пример паттерна:

```vue
<script setup lang="ts">
const componentGap = computed(() => resolveTokenValue(props.gap));
</script>

<style scoped>
.app-component {
  gap: v-bind(componentGap);
}
</style>
```

Такой подход используется в атомах вроде `AppFlex`, `AppGrid`, `AppBlock`, `AppPosition`.

Props компонента не должны превращаться в полноценную CSS-in-JS систему. Если значение является частью дизайн-системы, его нужно оформить как token и contract. Если значение одноразовое и относится только к конкретному компоненту, оно может остаться локальным.

## UI Слои

CSS следует тем же границам, что и UI-код.

`shared/components/atoms`:

- низкоуровневые layout, media и layer primitives;
- могут принимать style tokens через props;
- не должны знать feature-сценарии.

`shared/components/ui`:

- переиспользуемые UI-компоненты;
- используют semantic tokens;
- могут иметь публичные size/state variants.

`features/*/widget`:

- собирают несколько UI-компонентов в готовый сценарный блок;
- могут задавать композицию, padding, safe area и состояния конкретного сценария;
- не должны добавлять глобальные tokens без причины.

`view/*`:

- собирают layout и feature/widgets;
- обычно имеют минимум CSS;
- не должны становиться местом сложной визуальной композиции, если ее можно вынести в widget.

`layouts/*`:

- задают каркас приложения и экранов;
- отвечают за растяжение, базовую сетку и контейнеры;
- не должны знать детали feature-сценариев.

## Responsive CSS

Визуальная адаптация должна жить в CSS:

- `clamp()`;
- `min()`;
- `max()`;
- media queries;
- container queries, если адаптация зависит от контейнера.

Не нужно делать визуальные breakpoints через JS:

```ts
const isMobile = window.innerWidth < 768;
```

JS может использовать viewport только тогда, когда размер экрана меняет поведение приложения, а не только внешний вид.

Так как игра проектируется под landscape, responsive-логика должна учитывать:

- ширину viewport;
- высоту viewport;
- aspect ratio;
- safe area;
- размер touch controls;
- читаемость текста.

## Когда Добавлять Новый Token

Новый token нужен, если значение:

- повторяется в нескольких местах;
- выражает часть визуальной системы;
- должно масштабироваться вместе с `rem`;
- должно быть доступно через props и contract;
- связано с theme, safe area, z-index или типографикой.

Новый token не нужен, если значение:

- используется один раз;
- описывает частный layout конкретного компонента;
- является техническим значением анимации;
- является уникальной геометрией одного элемента.

## Базовые Правила

1. Глобальные значения живут в `src/app/styles/tokens`.
2. Базовое поведение страницы живет в `src/app/styles/core`.
3. Компоненты используют `<style scoped>` для локальной раскладки.
4. Компоненты берут размеры, цвета, радиусы, z-index и типографику из tokens.
5. Обычные tokens не должны содержать дополнительное ручное масштабирование.
6. Safe area используется через `--app-safe-area-*`, а не через прямой `env()` в компонентах.
7. TypeScript props для style tokens проходят через `contracts`.
8. Generated contracts не редактируются вручную.
9. Responsive layout делается CSS-средствами.
10. `codeStyle.md` описывает общий стиль кода, а CSS-детали живут в этом разделе.
