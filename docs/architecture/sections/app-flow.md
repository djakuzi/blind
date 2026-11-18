# Архитектура интерфейса

Слои `src/app`: за что отвечает каждый и какие зависимости между ними допустимы. Запуск приложения описан отдельно — в [Запуске приложения](./app-lifecycle.md).

## Слои

| Слой | Путь | Отвечает за | Не должен |
|---|---|---|---|
| setup | `src/app/setup` | подготовку систем приложения при запуске | содержать внутреннюю логику систем и экранов |
| router | `src/app/router` | маршруты, metadata, guards, redirects, lazy views и их preload | содержать логику сценариев |
| layouts | `src/app/layouts` | каркас экрана: header, footer, фон, safe area, общие переходы | знать детали конкретных features |
| providers | `src/app/providers` | глобальные механизмы, живущие вне route: loader, toast, dialog | содержать логику конкретной feature |
| overlay | `src/app/overlay` | механизмы поверх интерфейса: state, composable API, provider, presentation | описывать конкретный бизнес-сценарий |
| view | `src/app/view` | точка сборки экрана: layout + features + связка с route | содержать основную логику сценария |
| features | `src/app/features` | законченные сценарии: UI, composables, связка store с shared/core, подготовка данных | владеть другой feature напрямую |
| stores | `src/app/stores` | состояние приложения: state, getters, actions, persistence, связь с domain | владеть side effects UI (DOM, presentation) |
| domain | `src/app/domain` | предметные сущности, модели, API-абстракции, маппинг данных | зависеть от UI |
| shared | `src/app/shared` | общие компоненты, дизайн-система, utilities, contracts, composables | знать о features, views, routes |

1. Feature не обязана быть экранным блоком: её API можно использовать из setup, provider или view, если нет циклов.
2. Side effects окружения (DOM, platform presentation) применяет feature или orchestration поверх store, а не сам store.

## Router и lazy-маршруты

1. View маршрута подключается лениво. Механизм — `src/core/app/route/lazy`.
2. Следующие вероятные маршруты объявляются в `meta.lazy.preload`.
3. После навигации preload запускается по одному маршруту: первый — после анимации перехода, остальные — в idle браузера. Новая навигация прерывает очередь. Цепочки зависимостей не загружаются рекурсивно.
4. Preload — только оптимизация: без него маршрут загрузится при переходе.

## Shared components

`src/app/shared/components` разделён на слои. Слой определяет, что компонент может импортировать.

| Слой | Что внутри | Может импортировать |
|---|---|---|
| `atoms` | раскладка и форма без контента | ничего |
| `effects` | визуальные эффекты и переходы | ничего |
| `elements` | элементы без поведения: карточка, изображение, иконка, текст | `atoms` |
| `interaction` | поведение и overlays: удержание, слайдер, модалка | `atoms`, `effects`, `elements` |
| `ui` | компоненты, реагирующие на пользователя: кнопки, controls | `atoms`, `effects`, `elements`, `interaction`, `ui` |
| `widgets` | общие сборки из нескольких компонентов | любой слой |

1. Нужно состояние или реакция на ввод — место компонента в `ui` или `interaction`, не в `elements`.
2. Импорт внутри своего слоя допустим только в `ui` и `widgets`, без циклов.
3. Features, views, overlay и layouts могут импортировать любой слой.

## Shared styles

`src/app/shared/styles` — дизайн-система: tokens, contracts, presets, helpers, базовые стили, utilities. Не зависит от логики features.

## Зависимости

Более прикладной слой зависит от более базового. Это ориентир ответственности, а не строгая матрица.

| Слой | Может зависеть от |
|---|---|
| main | setup, router |
| setup | feature, store, overlay, shared, core |
| router | view |
| view | feature, layout, store, shared |
| feature | store, domain, shared, core |
| store | domain, shared, core |
| provider | overlay, feature, store, shared |
| layout | store, shared, общие composables |
| shared | core |

### Нежелательные связи

1. feature → feature, если одна начинает владеть другой.
2. shared → feature, view, router, layout.
3. domain → UI.
4. router → логика сценариев.
5. layout → логика конкретной feature.
6. store → конкретный компонент или view.
7. setup → presentation конкретного экрана.

Связь, нужная одному экрану, живёт во view или feature, а не в setup.
