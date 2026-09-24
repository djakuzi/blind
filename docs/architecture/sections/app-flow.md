# Архитектура и app-flow

Раздел описывает устройство `src/app`: bootstrap приложения, структуру app-слоев, правила зависимостей между ними и поток рендера от точки входа до экрана.

## Назначение папок в `src/app`

### `setup`

Слой легкой предварительной подготовки отдельных app-систем.

Здесь должна находиться логика, которая запускается один раз при старте приложения:

- подготовка конкретной app-системы до первого рендера;
- чтение легких пользовательских или системных предпочтений;
- настройка окружения, которое нужно до mount.

`setup` не отвечает за общую orchestration запуска приложения, регистрацию bootstrap resources или определение app readiness. Такая логика должна жить в `bootstrap`.

Например, `setupLanguage` определяет только preferred language. Реальная загрузка language manifest, locale-файла, проверка cache/version и применение итогового языка выполняются позже через `languageStore.initializeLanguage` во время app bootstrap.

Подробные правила локализации, разделение Static Locale и Full Locale, cache/fallback flow и language switch описаны в [локализации интерфейса](../../interface/sections/localization.md).

`setup` может использовать переиспользуемый API из `features`, если feature инкапсулирует композицию store/shared/core и не привязана к конкретному экрану. Например, `setupTheme` и `setupScale` используют composables из `features/settings`.

При этом в самом `setup` не должна жить логика конкретного экрана, узкого пользовательского сценария или общего bootstrap flow.

### `bootstrap`

App-level слой запуска приложения.

Здесь находится логика, которая связывает отдельные setup-системы, router, loader и lifecycle приложения:

- `bootstrap.ts` - orchestration запуска приложения;
- `bootstrap.const.ts` - ключи bootstrap scope и обязательных startup resources;
- `composables/useAppBootstrap.ts` - состояние готовности приложения для UI.

`bootstrap` отвечает за:

- регистрацию обязательных startup resources до mount;
- запуск реальной async initialization после mount;
- связь загрузочных задач с `stores/loader`;
- определение момента, когда приложение готово отдать управление `RouterView`.

`bootstrap` может использовать переиспользуемый API из `features`, если feature предоставляет готовую композицию app-state и более базовых слоев. Это допустимая зависимость app-level orchestration → feature. Например, language bootstrap использует `useStaticLocale`, который связывает `languageStore` с независимой инфраструктурой `shared/locale`.

Нежелательно тянуть в bootstrap feature API, который реализует экранный UI или узкий пользовательский сценарий: bootstrap должен зависеть только от той части feature, которая действительно является переиспользуемой app-level связкой.

На текущем этапе `app-bootstrap` содержит один реальный ресурс: `language`. Fake resources ради progress добавлять не нужно.

### `router`

Слой маршрутизации приложения.

Краткий обзор:

- `index.ts` - создание корневого router instance;
- `sections/*` - отдельные секции маршрутов (`menu`, `game`, `settings`);
- `guard/*` - route guards и связанная инфраструктура навигации;
- `constants/route.const.ts` - имена и ключи маршрутов;
- `types/vue-router.d.ts` - расширения типов `vue-router`.

`router` отвечает только за навигацию, структуру маршрутов и правила переходов. В нем не должно быть логики конкретной feature или тяжелой предметной логики.

### `layouts`

Слой app-layout'ов и общей каркасной разметки.

- `LayoutRoot.vue` - корневая layout-обертка для дерева маршрутов.
- `LayoutBase.vue` - базовая layout-обертка для экранов приложения.
- `layouts/components/*` - локальные layout-компоненты и контейнеры.
- `layouts/composables/*` - composable-логика, относящаяся именно к layout-слою.
- `layouts/constants/*` и `layouts/types/*` - служебные константы и типы layout-уровня.

`layouts` управляет каркасом экрана, обертками, контейнерами и общей структурой рендера. Этот слой не должен знать детали предметного сценария конкретной feature.

### `providers`

Глобальные app-level провайдеры интерфейса.

Если провайдер лежит в `app/providers`, это означает, что он создается для уровня всего приложения, а не для отдельного экрана или feature.

Такие провайдеры:

- могут использоваться из любой точки приложения;
- предоставляют глобальный UI-механизм;
- не должны содержать предметную бизнес-логику;
- не должны становиться местом для сценариев конкретной feature.

### `overlay`

Слой глобальных overlay-механизмов приложения.

К примеру:

- `overlay/loader` - визуальный глобальный loader mechanism;
- `bottomSheet`
- `modal`
- `toast`

Каждый overlay-контур может содержать:

- `composables` - API для вызова overlay;
- `widget` - UI-часть overlay.

`stores/loader` хранит состояние loader scopes/resources. `bootstrap` регистрирует реальные startup resources в loader store, а `ProviderLoaderApp` подключает loader overlay к корневому `App`.

`overlay` описывает глобальные механизмы отображения поверх основного интерфейса. Это app-level инфраструктура, а не слой бизнес-логики.

### `view`

Роутовые экраны верхнего уровня.

К примеру:

- `ViewMenu.vue`
- `ViewGame.vue`
- `ViewSettings.vue`

`view` - это точка входа в экран, которую открывает роутер.

Экран может:

- собирать layout;
- подключать `features`;
- связывать экран с app-level состоянием;
- передавать данные дальше в UI.

Экран не должен разрастаться в слой глобальной бизнес-логики и не должен дублировать ответственность feature-модулей.

### `features`

Слой пользовательских сценариев и составных экранных блоков.

Feature-модуль объединяет:

- UI конкретного сценария;
- composable-логику сценария;
- связь между экраном и store;
- локальную orchestration-логику.

Feature должна быть изолированной по ответственности и не должна напрямую зависеть от другой feature.

### `stores`

App-level состояние, доступное на уровне экранов и общего интерфейса.

К примеру в `app/stores` лежат store-модули:

- `settings`
- `user`
- `game`

Внутри store-модулей допускаются:

- state;
- getters/computed state;
- actions;
- локальные типы состояния;
- вспомогательная store-логика.

Store хранит состояние и операции над ним, но не должен становиться заменой feature-слою.

Store желательно использовать через `features`, а не дергать напрямую из любых точек приложения. Прямое использование store допустимо для app-level задач, bootstrap-логики и тонких экранных связок, где отдельная feature не нужна.

### `domain`

Слой предметных моделей, API и доменной логики.

Доменные модули должны быть сгруппированы по областям:

- `domain/game`
- `domain/settings`
- `domain/user`

Внутри них могут лежать:

- `api`
- `models`

`domain` должен описывать предметные сущности и работу с данными, а не рендер интерфейса.

### `shared`

Слой общих переиспользуемых примитивов.

Здесь могут лежать:

- общие компоненты;
- composables;
- constants;
- lib и вспомогательные утилиты.

`shared` используется как общий набор независимых примитивов. В нем не должна появляться логика конкретной feature, view или layout-сценария.

### `styles`

Глобальные стили приложения.

Здесь находятся:

- `index.css` - точка входа для app-стилей;
- `core/*` - reset, base и fonts;
- `tokens/*` - глобальные дизайн-токены приложения;
- `contracts/*` - контрактные стилевые сущности;
- `utilities/*` - утилитарные стилевые правила.

`styles` - глобальный слой визуальной системы. Здесь не должна жить логика экранов или feature-модулей.

## Правила импортов и зависимостей

### Общий принцип

Импорт должен идти из более прикладного слоя в более базовый или инфраструктурный. Слой не должен зависеть от соседа того же уровня, если это создает прямую связанность между сценариями.

### Допустимые зависимости

1. `main.ts` может подключать `app/router`, `app/bootstrap`, `app/providers`, `app/styles`, `Pinia` и app-level setup.
2. `router` может подключать route sections, route constants, guards и роутовые `view`.
3. `view` может подключать `features`, `layouts`, `shared` и при необходимости `stores`.
4. `features` могут подключать `stores`, `domain`, `shared` и app-level UI-примитивы.
5. `setup` и `bootstrap` могут использовать переиспользуемый feature API для композиции app-level состояния и инфраструктуры.
6. `stores` могут подключать `domain`, собственные `actions`, типы и вспомогательные утилиты.
7. `layouts` могут подключать свои локальные компоненты, composables, types и общие UI-примитивы.
8. `providers` и `overlay` могут использовать shared/app-level/features инфраструктуру для реализации глобального UI-механизма.

### Запрещенные и нежелательные связи

1. `features` нельзя импортировать в другие `features`.
2. `layouts` не должны импортировать feature-модули.
3. `router` не должен импортировать feature-модули напрямую.
4. `shared` не должен импортировать `features`, `view`, `router` или `layouts`.
5. `domain` не должен зависеть от UI-слоев. Может только делать импорт из shared.
6. `stores` нежелательно использовать хаотично напрямую из любых мест, если та же связка может быть оформлена через feature.

## App-flow

Поток управления в `app`-слое на старте приложения:

1. `src/main.ts` создает Vue-приложение.
2. В `main.ts` подключаются app-level плагины и инфраструктура, например `Pinia`.
3. `main.ts` выполняет pre-render setup: `setupView`, `setupLanguage`, `setupScale`, `setupTheme`.
4. `prepareAppBootstrap` регистрирует обязательные startup resources, например `app-bootstrap/language`, и использует Static Locale для bootstrap-текста до загрузки Full Locale.
5. `main.ts` подключает router из `src/app/router` и ожидает `router.isReady()`.
6. `main.ts` монтирует `App`.
7. `ProviderLoaderApp` сразу отображает loader overlay, если в loader store есть незавершенные resources.
8. `runAppBootstrap` запускает реальную async initialization, например `languageStore.initializeLanguage`.
9. После завершения startup resources scope `app-bootstrap` становится loaded.
10. `useAppBootstrap` считает приложение готовым по состоянию `app-bootstrap`, и `App.vue` открывает `RouterView`.

Коротко по language flow:

```text
setupLanguage
→ preferred language only

Static Locale
→ bootstrap text before Full Locale

bootstrap
→ initialize Full Locale

RouterView
→ только после language resource completion
```

Минимальная встроенная locale infrastructure находится в `src/app/shared/locale`. Обычный пользовательский UI после bootstrap должен использовать Full Locale.

После готовности приложения router определяет текущий маршрут и выбирает нужную route section. Route section подключает соответствующий `layout` и роутовый `view`, `LayoutRoot.vue` и `LayoutBase.vue` собирают каркас приложения и экрана, а `view` подключает нужные `features`.

## Базовые правила

1. Все, что относится к запуску и каркасу приложения, должно жить в `app`.
2. `view` остается точкой сборки экрана, а не местом для всей логики сценария.
3. Feature не импортирует другую feature.
4. Store предпочтительно используется через feature-слой, а не напрямую из произвольных мест.
5. Глобальные UI-механизмы должны жить в `app/providers` и `app/overlay`.
6. `router` и `layouts` не должны содержать тяжелую предметную логику.
7. `shared` должен оставаться независимым переиспользуемым слоем.
8. Готовность приложения должна определяться состоянием bootstrap scope, а не общим `loaderStore.isLoaded`, потому что в приложении могут быть другие loader scopes после старта.
