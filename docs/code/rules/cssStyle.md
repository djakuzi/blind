# CSS Style

Как писать стили: именование, design tokens, contracts, стили компонентов и адаптивность.

## Два уровня CSS

| Уровень | Где | Отвечает за |
|---|---|---|
| Глобальная дизайн-система | `src/app/shared/styles` | tokens, reset, шрифты, корень страницы, редкие общие utilities |
| Стили компонента | `<style scoped>` в компоненте | раскладка, состояния, BEM-модификаторы, локальные переменные |

1. Глобальный CSS не описывает конкретный экран, widget или feature.
2. Глобальные файлы подключаются по зависимости: подготовка страницы → tokens → применение к корню.

## Именование

| Что | Формат | Пример |
|---|---|---|
| Класс | `kebab-case`, BEM | `.app-example__title--active` |
| Общий класс проекта | префикс `app-` | `.app-example` |
| Глобальная переменная | префикс `--app-` | `--app-space-4` |
| Переменная компонента | префикс `--cp-` | `--cp-example-gap` |

Вложенные селекторы — через CSS Nesting:

```css
.app-example {
  gap: var(--app-space-4);

  &__title {
    color: var(--app-color-text-primary);
  }

  &--active {
    background: var(--app-color-surface-interactive);
  }
}
```

## Design tokens

1. Повторяемые визуальные значения — размеры, цвета, радиусы, z-index, типографика — берутся из tokens.
2. Если token уже есть, произвольное значение не пишется.
3. Tokens не домножаются на `--app-scale` — масштаб уже заложен в `rem`.

### Когда нужен новый token

| Нужен | Не нужен |
|---|---|
| значение повторяется в нескольких местах | значение используется один раз |
| часть визуальной системы | частная раскладка одного компонента |
| должно масштабироваться через `rem` | техническое значение анимации |
| передаётся через props и contract | уникальная геометрия одного элемента |
| связано с темой, safe area, z-index, типографикой | |

## Цвета и темы

1. Компонент использует semantic tokens и не собирает light/dark значения сам — для этого tokens и `light-dark()`.
2. Не хватает цвета для состояния — сначала semantic token в дизайн-системе, потом использование.

## Safe area

Компонент использует project tokens `--app-safe-area-*`, а не `env(safe-area-inset-*)` напрямую.

```text
env(safe-area-inset-*) → project tokens → padding / offset компонента
```

## Contracts, presets, helpers

| Механизм | Назначение |
|---|---|
| contract | допустимые значения стилевого prop и превращение token в CSS-значение (`resolve*Value`) |
| preset | согласованный набор значений для варианта компонента (например, размера) |
| helper | повторяемое преобразование поверх contracts, без решений о состояниях компонента |

1. Style token, пришедший через prop, проходит через contract.
2. Generated contracts не редактируются руками — меняется source token и запускается генератор.
3. Перед новым механизмом проверяются существующие contracts, presets и helpers.

## Стили компонента

1. Значение prop попадает в CSS через `computed` и `v-bind()`.
2. Props не превращаются в CSS-in-JS: значение дизайн-системы — это token и contract, одноразовое значение остаётся локальным.

```vue
<script setup lang="ts">
const exampleGap = computed(() => resolveSpaceValue(props.gap));
</script>

<style scoped>
.app-example {
  gap: v-bind(exampleGap);
}
</style>
```

## CSS по слоям UI

| Слой | Что может в CSS |
|---|---|
| primitives | принимать tokens через props и применять через contracts |
| переиспользуемые компоненты | semantic tokens, свои варианты и состояния |
| widgets | композиция, safe area, раскладка сценария, без новых глобальных tokens |
| views | минимум CSS — это точки сборки |
| layouts | каркас, растяжение, сетка, контейнеры |

## Адаптивность

1. Визуальная адаптация — в CSS: `clamp()`, `min()`, `max()`, media и container queries.
2. Визуальные breakpoints через JS (`window.innerWidth`) не делаются. JS смотрит на viewport, только если меняется поведение, а не вид.
3. Игра проектируется под landscape: учитываются ширина и высота viewport, aspect ratio, safe area, размер touch-целей, читаемость текста.

## Связанные разделы

- [Масштабирование интерфейса](../../interface/sections/ui-scale.md) — почему размеры задаются в `rem` и tokens не масштабируются повторно.
- [Генератор style contracts](../../generators/sections/generate-style-contracts.md) — как contracts получаются из tokens и почему их нельзя править руками.
