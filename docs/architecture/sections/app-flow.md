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
        ├── registry
        │   └── appSetup.registry.ts
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

Готовность приложения определяется завершением всех обязательных blocking post-mount задач.

Инвариант:

```text
app isReady
→ все blocking postMount setup завершены
```

Background-задачи не должны удерживать основной UI.

App readiness не равен состоянию глобального loader:

```text
setup readiness
≠
global loader activity
```

Loader может использоваться в любой момент жизни приложения и не должен повторно переводить весь route UI в состояние "not ready".

## Loader И Setup

Setup-модуль может регистрировать loader resource, если его initialization должен быть визуально представлен пользователю.

При этом:

- setup lifecycle определяет готовность приложения;
- loader отвечает за отображение процесса;
- конкретный setup-модуль связывает свою задачу с loader resource при необходимости.

Runner не должен зависеть от конкретного loader implementation.

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
install app-level infrastructure
↓
create setup registry
↓
run preMount setup
↓
prepare router
↓
mount root UI
↓
run postMount setup
├── blocking
└── background
↓
blocking complete
↓
app isReady
↓
normal route UI
```

Конкретный набор setup-модулей и их внутренний порядок может меняться.

Основной route UI должен открываться только после готовности обязательных app-систем.

## Error Handling

Setup-системы должны различать:

- recoverable failure;
- fallback;
- critical blocking failure;
- background failure.

Если существует fallback, система должна по возможности сохранить рабочее состояние.

Critical blocking failure не должен тихо переводить приложение в состояние ready.

Ошибка background-задачи не должна блокировать основной UI, но должна быть явно обработана или зафиксирована.

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
