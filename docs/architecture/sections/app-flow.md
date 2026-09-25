# Архитектура и app-flow

Раздел описывает назначение основных слоёв внутри `src/app`, общий lifecycle приложения и правила зависимостей между app-level системами.

Документация фиксирует архитектурные принципы, а не конкретную последовательность импортов или текущий набор файлов. Внутренняя реализация может меняться, если сохраняются границы ответственности и инварианты lifecycle.

## Setup

`setup` — единый app-level lifecycle для подготовки и запуска систем приложения.

Он объединяет startup-логику в один lifecycle вместо нескольких независимых startup-слоёв. Конкретная система может участвовать в одной или нескольких фазах lifecycle.

Базовые фазы:

```text
preMount
↓
app.mount()
↓
postMount
```

### preMount

`preMount` используется для работы, которая должна завершиться до mount корневого приложения.

Типичные задачи:

- чтение пользовательских предпочтений;
- чтение системных настроек;
- подготовка platform-specific окружения;
- применение визуальных параметров, которые не должны мигать после первого рендера;
- подготовка состояния, необходимого для post-mount initialization.

### postMount

`postMount` используется для работы, которая должна или может выполняться после mount.

Post-mount задачи разделяются по execution mode:

```text
blocking
background
```

`blocking` означает, что основной route UI не считается готовым до завершения задачи.

`background` означает, что задача запускается после mount, но не влияет на app readiness.

Таким образом две независимые характеристики не смешиваются:

```text
lifecycle phase
→ когда запускать

execution mode
→ влияет ли задача на готовность приложения
```

Асинхронность сама по себе не является отдельной lifecycle-фазой.

## Setup Structure

Setup разделён на универсальный lifecycle-механизм и composition конкретного приложения:

```text
src
├── core
│   └── app
│       └── setup
│           ├── setup.runner.ts
│           ├── setup.state.ts
│           ├── setup.type.ts
│           └── useSetup.ts
│
└── app
    └── setup
        ├── appSetup.registry.ts
        ├── interface
        │   ├── language.setup.ts
        │   ├── scale.setup.ts
        │   └── theme.setup.ts
        └── platform
            └── view.setup.ts
```

### `core/app/setup`

Содержит общий контракт lifecycle, runner, внутреннее состояние setup и reactive API состояния.

Механизм не должен знать о конкретных app-системах, Pinia stores, loader, языке, теме или platform setup Blind.

### `app/setup/registry`

Определяет, какие setup-модули конкретного приложения участвуют в lifecycle.

Registry является composition point и может меняться по мере появления или удаления app-систем.

### `app/setup/interface`

Содержит setup интерфейсных систем приложения, например языка, темы и UI scale.

### `app/setup/platform`

Содержит setup platform presentation и окружения, например orientation, status bar и WebView.

Конкретный setup-модуль может реализовывать:

- только `preMount`;
- только `postMount`;
- обе фазы.

Setup-модуль должен координировать систему через её публичный API, а не дублировать внутреннюю business/domain логику.

UI получает reactive состояние lifecycle через `useSetup` и не зависит от внутренней реализации runner.

## App Readiness

Готовность приложения определяется runtime-состоянием обязательных blocking post-mount задач.

Для каждой blocking-задачи runner хранит статус:

```text
pending
loaded
error
```

Инвариант:

```text
app isReady
→ postMount lifecycle уже начался
→ все blocking postMount setup имеют status = loaded
```

Если хотя бы один blocking setup имеет `pending`, приложение ещё запускается.

Если хотя бы один blocking setup имеет `error`, основной route UI остаётся закрытым до восстановления этой задачи.

Если blocking setup отсутствуют, после старта post-mount lifecycle приложение считается готовым сразу.

Background-задачи не входят в карту blocking-состояний и не удерживают основной UI.

App readiness не равен состоянию глобального loader:

```text
setup readiness
≠
global loader activity
```

Loader может использоваться в любой момент жизни приложения и не должен повторно переводить уже запущенный route UI в состояние "not ready".

## Loader И Setup

Setup-модуль может регистрировать loader resource, если его initialization должен быть визуально представлен пользователю.

Loader resource имеет собственное состояние:

```text
pending
├── success → loaded
└── failure → error
                 │
                 └── retry → pending
```

Resource является единственным источником истины для своего loading-состояния. Ошибка хранится непосредственно внутри resource и может содержать action для восстановления.

Scope группирует связанные resources и может содержать presentation-title. Отдельный `scope.isLoaded` не хранится: завершённость scope вычисляется по его resources.

Глобальный loader считает progress как отношение:

```text
loaded resources / all resources
```

Presentation выбирается provider-слоем:

```text
есть error resource
→ показать error state

иначе есть pending resource
→ показать progress state

все resources loaded
→ завершить visual lifecycle и скрыть overlay
```

Если ошибок несколько, provider показывает первую доступную ошибку. После её успешного retry следующая ошибка, если она существует, становится текущей.

При этом:

- setup lifecycle определяет готовность приложения;
- loader отвечает только за визуальное отображение loading/error процесса;
- конкретный setup-модуль связывает свою задачу с loader resource;
- завершённые loader scopes сохраняются до окончания визуального ухода глобального loader;
- после leave-анимации provider очищает завершённые scopes.

Runner не зависит от loader implementation.

Widget глобального loader остаётся presentation-компонентом: он получает `progress`, `text`, `error` и action через provider, отображает `AppLineLoader` или `AppStatusBlock`, но напрямую store не использует.

### Blocking Setup Retry

Recoverable blocking setup может быть повторно запущен через generic runner API:

```text
retryPostMountSetup(setupKey)
```

Retry допустим только для blocking setup со статусом `error`.

Поток восстановления:

```text
blocking setup = error
loader resource = error
↓
user action
↓
retryPostMountSetup(setupKey)
↓
blocking setup = pending
loader resource = pending
↓
setup.run()
├── success
│   ├── loader resource = loaded
│   └── blocking setup = loaded
│
└── failure
    ├── loader resource = error
    └── blocking setup = error
```

Когда после retry все blocking setup становятся `loaded`, `useSetup().isReady` автоматически становится `true`.

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

Overlay описывает механизм, а не конкретный business-сценарий его использования.

## Views

`view` — route-level точка сборки экрана.

View может:

- подключать layout;
- подключать одну или несколько features;
- связывать route params/meta с feature API;
- выполнять тонкую composition-логику.

View не должен содержать основную business-логику сценария или дублировать ответственность feature/store.

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

Переиспользуемый feature API допустимо использовать из setup, provider, view или другого app-level orchestration, если это не создаёт циклическую или узкосценарную связанность.

## Stores

`stores` отвечают за app-level состояние и операции над ним.

Store может содержать:

- state;
- getters;
- actions;
- state-related helpers;
- persistence, если она относится к состоянию;
- связь с domain/API.

Store не должен владеть side effects конкретного UI-окружения, если они не являются частью самого состояния.

Например, изменение DOM, platform presentation или component behavior обычно должно применяться feature/app-level orchestration поверх store.

## Domain

`domain` описывает предметные сущности и операции с данными.

Сюда относятся:

- models;
- API abstractions;
- domain-specific data types;
- mapping raw data в предметные сущности.

Domain не должен зависеть от UI-слоёв.

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

Главное правило:

```text
shared
→ не знает о конкретном feature/view/route
```

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

Общий принцип: более прикладной слой может зависеть от более базового или от переиспользуемого API app-слоя, если это не создаёт циклическую или узкосценарную связанность.

Типичные направления:

```text
main
→ app setup / core app setup / router

setup
→ feature / store / overlay / shared / core

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

Это ориентир ответственности, а не строгая compile-time матрица.

## Нежелательные Зависимости

Следует избегать:

- feature → feature, если один сценарий начинает напрямую владеть другим;
- shared → feature/view/router/layout;
- domain → UI;
- router → business feature logic;
- layout → узкосценарная feature logic;
- store → конкретный component/view;
- setup → screen-specific presentation;
- core app setup → конкретный feature/store/overlay.

Если связь нужна только одному экрану, её место обычно во view или feature, а не в app lifecycle.

## App Lifecycle

Общий поток запуска:

```text
create application
↓
install Pinia
↓
create app setup registry
↓
run preMount setup sequentially
↓
install/prepare router
↓
mount root UI
↓
run postMount setup
├── blocking → tracked by pending / loaded / error
└── background → fire-and-handle-error, readiness не блокирует
↓
all blocking = loaded
↓
app isReady
↓
normal route UI
```

`App.vue` всегда держит глобальные providers смонтированными, но `RouterView` показывает только при `isReady = true`.

Если blocking setup падает, приложение остаётся смонтированным, providers продолжают работать, а route UI остаётся закрытым. Это позволяет loader показать recoverable error и выполнить retry без перезагрузки приложения.

Конкретный набор setup-модулей и их внутренний порядок может меняться.

## Error Handling

Setup-системы должны различать:

- recoverable blocking failure;
- fallback;
- fatal pre-mount failure;
- background failure.

Recoverable blocking failure должен оставить setup в `error`, не открывать route UI и предоставить app-level способ восстановления, например loader action с `retryPostMountSetup`.

Если существует безопасный fallback, особенно в `preMount`, его предпочтительно применить локально и продолжить startup.

`preMount` выполняется до `app.mount()`, поэтому глобальный loader в этой фазе ещё недоступен. Ошибка, вышедшая наружу из `runPreMountSetup`, считается fatal startup error. Верхний `setupApp().catch(...)` обязан как минимум явно её зафиксировать; конкретные pre-mount системы должны по возможности иметь собственные fallback.

Ошибка background-задачи логируется, но не блокирует основной UI.

Critical blocking failure не должен тихо переводить приложение в состояние ready.

## Setup Module Design

Setup-модуль должен описывать lifecycle конкретной системы, а не становиться местом её внутренней реализации.

Предпочтительно:

```text
setup module
↓
feature/system API
↓
store/domain/core
```

Вместо:

```text
setup module
↓
ручная сборка внутренних шагов системы
```

Это позволяет менять реализацию системы без переписывания общего lifecycle.

## Базовые Правила

1. Универсальный setup lifecycle живёт в `core/app/setup`, а setup конкретных систем приложения — в `app/setup`.
2. `preMount` используется для работы, обязательной до mount.
3. Blocking `postMount` определяет app readiness.
4. Background `postMount` не блокирует основной UI.
5. `core/app/setup` не знает о конкретных системах приложения.
6. Registry является composition point setup-модулей.
7. View остаётся точкой сборки route screen.
8. Feature инкапсулирует сценарии и переиспользуемые app-композиции.
9. Shared остаётся независимым от app-specific сценариев.
10. Domain не зависит от UI.
11. Store хранит состояние, а application side effects применяются на подходящем orchestration-уровне.
12. Setup readiness отделён от обычной loader activity.

## Ориентиры В Проекте

Основные app-области:

```text
src/core/app/setup
src/app/setup
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

Пути являются навигационными ориентирами, а не обязательной внутренней реализацией.
