# Архитектура и app-flow

Раздел описывает назначение слоёв внутри `src/app`, их зоны ответственности и допустимые зависимости.

Документация фиксирует архитектурные принципы, а не текущую последовательность импортов или конкретные имена файлов. Внутренняя реализация может меняться, если сохраняются границы слоёв и общий lifecycle приложения.

## Setup

`setup` — слой лёгкой предварительной подготовки app-систем до основного пользовательского рендера.

Типичные задачи setup:

- чтение пользовательских предпочтений;
- чтение системных настроек;
- подготовка platform-specific окружения;
- начальная настройка темы, масштаба, языка или viewport;
- подготовка состояния, которое должно существовать до mount или до bootstrap initialization.

Setup не должен:

- определять глобальную готовность приложения;
- управлять всем startup flow;
- хранить screen-specific сценарии;
- подменять bootstrap orchestration.

Setup может использовать переиспользуемый feature API, если feature предоставляет самостоятельную app-level композицию и не привязана к конкретному экрану.

## Bootstrap

`bootstrap` — app-level orchestration запуска приложения.

Его задача — координировать системы, которые должны стать готовыми до открытия обычного route UI.

Bootstrap может:

- регистрировать обязательные startup resources;
- запускать async initialization;
- связывать startup-задачи с глобальным loader/error state;
- определять app readiness;
- использовать Static Locale для UI, который показывается до Full Locale;
- использовать переиспользуемые feature API.

Bootstrap не должен:

- содержать бизнес-логику конкретного экрана;
- превращаться в место для всех initialization-сценариев без разделения ответственности;
- зависеть от деталей presentation конкретного route.

Общий принцип:

```text
pre-render setup
↓
app bootstrap
↓
required systems ready
↓
route UI
```

Если система не является обязательной для первого пользовательского экрана, её не обязательно включать в главный bootstrap gate.

## Router

`router` отвечает за навигацию и структуру route tree.

Его ответственность:

- route definitions;
- route names и metadata;
- guards;
- redirects;
- lazy loading route views.

Router не должен содержать feature business logic.

Route может выбирать view и передавать metadata, но сценарий экрана должен жить ниже — во view/features.

## Layouts

`layouts` отвечают за общий каркас интерфейса.

Сюда относятся:

- общая структура экрана;
- header/footer/background;
- safe-area composition;
- общие transitions;
- placement route content.

Layout должен быть максимально нейтрален к предметному сценарию.

Он может использовать общие app-state или shared UI, но не должен знать детали конкретной feature.

## Providers

`providers` — глобальные точки подключения app-level UI или context mechanisms.

Provider нужен, когда механизм должен существовать независимо от текущего route.

Типичные примеры:

- global loader;
- toast;
- dialog;
- bottom sheet;
- global context bridge.

Provider не должен становиться контейнером feature-specific логики.

## Overlay

`overlay` содержит глобальные механизмы отображения поверх основного интерфейса.

Overlay-система может включать:

- store/state;
- composable API;
- provider;
- widget/presentation.

Overlay описывает механизм, а не конкретный бизнес-сценарий его использования.

Например, loader может знать про scopes/resources/progress, но не обязан знать, что именно означает каждый startup resource.

## Views

`view` — route-level точка сборки экрана.

View может:

- подключать layout;
- подключать одну или несколько features;
- связывать route params/meta с feature API;
- выполнять тонкую composition-логику.

View не должен:

- содержать основную бизнес-логику сценария;
- дублировать store actions;
- превращаться в большую монолитную feature.

Правильная идея:

```text
route
↓
view
↓
feature composition
↓
shared UI / domain / stores
```

## Features

`features` — слой законченных переиспользуемых app-сценариев и композиций.

Feature может содержать:

- UI конкретного сценария;
- composables;
- связку между store и shared/core;
- локальную orchestration;
- подготовку presentation data;
- переиспользуемый API без собственного route.

Feature не обязана быть только экранным блоком.

Например, feature может предоставлять композицию:

```text
store
+
shared infrastructure
↓
reactive app-level API
```

Такой API допустимо использовать из setup, bootstrap, provider или view.

Feature должна иметь самостоятельную ответственность и по возможности не зависеть от другой feature напрямую.

## Stores

`stores` отвечают за app-level состояние и операции над ним.

Store может содержать:

- state;
- getters;
- actions;
- state-related helpers;
- persistence orchestration, если она является частью состояния;
- связь с domain/API.

Store не должен:

- хранить presentation конкретного экрана;
- заменять feature;
- содержать UI-specific branching.

Store желательно потреблять через feature, если feature добавляет смысловую композицию. Прямое использование store допустимо на app-level, в bootstrap и в тонких view/layout связках, если дополнительная feature не даёт пользы.

## Domain

`domain` описывает предметные сущности и операции с данными.

Сюда относятся:

- models;
- API abstractions;
- domain-specific data types;
- mapping raw data в предметные сущности.

Domain не должен зависеть от UI-слоёв.

Presentation, переводы и route-specific состояние не относятся к domain.

## Shared

`shared` — слой независимых переиспользуемых примитивов.

Сюда могут входить:

- UI atoms/primitives;
- generic widgets;
- utilities;
- helpers;
- contracts;
- generic composables;
- infrastructure primitives.

Главное правило shared:

```text
shared
→ ничего не знает о конкретном feature/view/route
```

Shared может использовать более базовые core/platform abstractions, но не должен импортировать app-specific сценарии ради удобства одного consumer.

## Styles

`styles` содержит глобальную визуальную систему:

- tokens;
- contracts;
- base styles;
- utilities;
- typography;
- spacing;
- colors;
- responsive primitives.

Styles описывают визуальные правила и не должны зависеть от feature logic.

## Допустимые Зависимости

Общий принцип: более прикладной слой может зависеть от более базового или от переиспользуемого API соседнего app-слоя, если это не создаёт циклическую или узкосценарную связанность.

Типичные допустимые связи:

```text
main
→ setup / bootstrap / router / providers

setup
→ feature / store / shared / core

bootstrap
→ feature / store / overlay / shared

router
→ view

view
→ feature / layout / shared / store

feature
→ store / domain / shared / core

store
→ domain / shared / core

provider
→ overlay / feature / store / shared

layout
→ shared / store / app-level composables

shared
→ core
```

Это не строгая compile-time матрица импортов, а ориентир по направлению ответственности.

## Нежелательные Зависимости

Следует избегать:

- feature → feature, если один сценарий начинает напрямую владеть другим;
- shared → feature/view/router/layout;
- domain → UI;
- router → business feature logic;
- layout → узкосценарная feature logic;
- store → конкретный component/view;
- setup/bootstrap → screen-specific presentation.

Если связь нужна только одному конкретному экрану, её место обычно во view или feature, а не в глобальной инфраструктуре.

## App Lifecycle

Общий lifecycle приложения:

```text
create application
↓
install app-level infrastructure
↓
pre-render setup
↓
prepare bootstrap state
↓
mount root UI
↓
run required async initialization
↓
mark required systems ready
↓
open normal route UI
```

Конкретное количество bootstrap resources, их имена и порядок могут меняться.

Главный инвариант:

```text
route UI opens
→ required app systems are ready
```

Если во время bootstrap нужен пользовательский текст, он не должен зависеть от системы, которая сама ещё находится в процессе initialization.

## App Readiness

Готовность приложения должна определяться отдельным bootstrap state/scope, а не общим состоянием всех loader-задач.

Причина:

после запуска приложения могут появляться другие loader scopes, которые не должны снова переводить всё приложение в состояние "not ready".

Правильно:

```text
bootstrap readiness
≠
global loader activity
```

Global loader отвечает за отображение текущих loading tasks.

Bootstrap readiness отвечает только за то, можно ли открыть основной интерфейс.

## Error Handling

Startup-системы должны различать:

- recoverable failure;
- fallback;
- critical initialization failure.

Если существует fallback, система должна сначала попытаться сохранить рабочее состояние.

Critical failure не должен приводить к тихому частично инициализированному приложению.

Bootstrap может использовать глобальный error/overlay механизм, но конкретная стратегия обработки зависит от системы.

## Setup И Bootstrap: Разница

Коротко:

```text
setup
→ подготовить отдельную систему

bootstrap
→ скоординировать обязательные системы
```

Setup не определяет готовность приложения.

Bootstrap не обязан знать детали внутренней реализации каждой системы.

Система должна по возможности предоставлять bootstrap готовую операцию высокого уровня:

```text
initialize()
prepare()
load()
```

вместо того чтобы заставлять bootstrap собирать её внутренний алгоритм вручную.

## Feature Как Переиспользуемая Композиция

Feature может использоваться выше route-level, если она представляет самостоятельную переиспользуемую композицию.

Хороший пример абстракции:

```text
feature
→ связывает store + shared/core
→ возвращает app-level API
```

Плохой пример зависимости:

```text
bootstrap
→ feature конкретного screen
→ component state
→ modal flow
```

Поэтому критерий — не название слоя, а ответственность API.

## Базовые Правила

1. App-level startup orchestration живёт в bootstrap.
2. Лёгкая подготовка отдельных систем живёт в setup.
3. View остаётся точкой сборки route screen.
4. Основной сценарий и композиция состояния оформляются как feature.
5. Shared остаётся независимым от app-specific сценариев.
6. Domain не зависит от UI.
7. Store хранит состояние, но не presentation конкретного экрана.
8. Providers и overlays реализуют глобальные механизмы, а не предметные сценарии.
9. Bootstrap readiness отделён от обычной loader activity.
10. Допустимость зависимости определяется ответственностью API, а не только названием папки.

## Ориентиры В Проекте

Основные app-области:

```text
src/app/setup
src/app/bootstrap
src/app/router
src/app/layouts
src/app/providers
src/app/overlay
src/app/view
src/app/features
src/app/stores
src/app/domain
src/app/shared
src/app/styles
```

Эти пути нужны для навигации по проекту и не являются описанием обязательной внутренней реализации.
