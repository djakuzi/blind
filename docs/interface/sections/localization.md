# Локализация интерфейса

Локализация в `blind` разделена на два уровня:

```text
Static Locale
≠
Full Locale
```

Это разделение определяет не способ хранения переводов, а их ответственность.

- Static Locale покрывает минимальный инфраструктурный UI, который может понадобиться до готовности основной системы локализации.
- Full Locale является основным источником пользовательских текстов после инициализации приложения.

Документация описывает архитектурные правила. Конкретный transport, источник файлов, способ кеширования или внутренняя реализация могут меняться, если сохраняются описанные ниже границы и инварианты.

## Static Locale

Static Locale — небольшой встроенный набор инфраструктурных текстов.

Он должен:

- быть доступен без загрузки Full Locale;
- не зависеть от внешнего transport;
- не требовать готового списка поддерживаемых языков;
- иметь безопасный fallback;
- содержать только тексты, необходимые до готовности основного интерфейса.

Static Locale не должен превращаться во второй полноценный набор переводов приложения.

Типичные кандидаты:

```text
bootstrap
loading
critical startup states
```

Обычный экранный и предметный UI должен оставаться в Full Locale.

### Разделение инфраструктуры и состояния

Базовая работа со Static Locale должна быть независимой от состояния приложения:

```text
static locale infrastructure
→ registry
→ normalization
→ fallback
→ locale resolution
```

Связь этой инфраструктуры с текущим состоянием языка относится к feature/app composition:

```text
language state
+
static locale infrastructure
↓
reactive static locale
```

Поэтому общий locale-слой не должен знать о конкретном store или feature, а переиспользуемая feature может связывать их между собой.

Такая feature-композиция допустима как для обычного UI, так и для app-level orchestration, включая setup и bootstrap.

## Full Locale

Full Locale — основной контракт пользовательского интерфейса после завершения языковой инициализации.

Источник Full Locale не является частью UI-контракта. Переводы могут приходить:

- из bundled ресурсов;
- из локального cache;
- из remote API;
- из комбинации нескольких источников.

UI не должен зависеть от того, откуда физически получен перевод.

Правильная граница:

```text
source / transport / cache
↓
language domain/store
↓
Locale contract
↓
UI
```

Неправильная граница:

```text
UI
↓
конкретный JSON / endpoint / filesystem path
```

## Locale Contract

Full Locale должен иметь типизированный и предсказуемый контракт.

Структура строится по смыслу текста, а не по месту его физического хранения.

Основные категории:

- общие тексты приложения;
- тексты конкретных экранов и сценариев;
- локализованные значения настроек;
- presentation игровых сущностей;
- presentation технических идентификаторов;
- форматируемые текстовые шаблоны.

Пример смыслового разделения:

```text
common
views
settings
game
connectionTypes
```

Это пример архитектурных категорий, а не требование навсегда сохранять текущий набор root-полей.

### Общие тексты

Глобальный текст, который используется в разных частях приложения, не должен дублироваться внутри отдельных экранов.

Например:

```text
navigation.back
confirm
cancel
```

### Тексты экранов

Текст, принадлежащий конкретному screen или subview, должен быть сгруппирован рядом с контекстом этого экрана.

Рекомендуемая смысловая структура:

```text
view
→ subview
→ ui / modals / states
```

### Значения настроек

Нужно различать название настройки и локализованное значение настройки.

Например:

```text
"Тема приложения"
≠
"Тёмная"
```

Первое относится к UI конкретного экрана, второе — к presentation значения настройки.

### Presentation предметных сущностей

Техническая сущность и её пользовательское представление должны быть разделены.

Domain/config хранит:

```text
identifier
options
technical metadata
relations
```

Locale хранит:

```text
title
description
user-facing labels
```

Технический identifier не должен меняться вместе с языком интерфейса.

## Выбор языка

Система должна различать:

- явный выбор пользователя;
- язык, автоматически определённый из окружения;
- fallback приложения.

Приоритет обычно выглядит так:

```text
explicit user preference
↓
system/environment preference
↓
application default
```

Автоматически определённый язык не следует сохранять как явный выбор пользователя. Иначе последующее изменение языка системы перестанет иметь ожидаемый эффект.

### Нормализация language code

Language code должен нормализоваться перед сравнением.

Рекомендуемая стратегия:

```text
exact locale
↓
base language
↓
fallback
```

Примеры:

```text
ru-RU → ru-RU → ru
en_US → en-us → en
unknown → application fallback
```

Система не должна требовать отдельный перевод для каждого regional tag, если базовый язык уже поддерживается.

## Lifecycle

Языковая инициализация делится на две задачи.

### Pre-render preference resolution

До основного bootstrap можно определить предпочтительный language code из сохранённых пользовательских настроек или системного окружения.

На этом этапе Full Locale ещё не обязан быть доступен.

### Full Locale initialization

До открытия обычного пользовательского UI должны быть определены:

- список или источник поддерживаемых языков;
- итоговый активный язык;
- валидный Full Locale;
- состояние готовности языковой системы.

Инвариант:

```text
language initialized
→ active language exists
→ Full Locale exists
```

Если приложение использует bootstrap gate, обычный route UI не должен рендериться раньше выполнения этого инварианта.

Static Locale может использоваться для bootstrap UI до выполнения Full Locale initialization.

## Fallback

Fallback должен быть явным и многоуровневым.

Для выбора языка:

```text
preferred language
↓
base language
↓
default supported language
```

Для загрузки данных:

```text
preferred source
↓
valid local fallback
↓
default locale source
```

Конкретная стратегия может меняться, но отказ одного источника не должен автоматически приводить к частично инициализированному UI.

Fallback Static Locale и fallback Full Locale являются независимыми понятиями. Static fallback не определяет default Full Locale приложения.

## Cache И Versioning

Locale можно кешировать, если это уменьшает лишние загрузки или обеспечивает offline/fallback сценарий.

Cache должен считаться оптимизацией и источником восстановления, а не частью UI-контракта.

Если используется versioning, общий принцип:

```text
language metadata version
↓
cached locale version
├── compatible → reuse
└── incompatible → refresh
```

При изменении формата хранения или transport UI не должен требовать изменений, пока итоговый Locale contract остаётся прежним.

Небольшие metadata и большие locale payload могут храниться разными способами.

## Runtime Language Switch

Смена языка должна быть atomic-like операцией.

Правильный порядок:

```text
resolve target language
↓
prepare valid target locale
↓
persist explicit preference
↓
activate language + locale
↓
update document/platform presentation
```

Нельзя сначала переключить active language, а потом пытаться получить его Locale.

Если подготовка нового языка не удалась, текущий рабочий Locale должен оставаться активным.

Reactive consumers должны обновляться без полной перезагрузки приложения.

## Названия Языков

Название языка в picker желательно показывать на текущем языке интерфейса, если платформа предоставляет корректный internationalization API.

Например:

```text
English UI → Russian
Russian UI → английский
```

В качестве fallback можно использовать собственное display name языка из metadata.

Не следует хранить полный cross-language mapping названий всех поддерживаемых языков внутри каждого Locale: такая схема плохо масштабируется.

## Pluralization

Plural category должна определяться стандартными internationalization API платформы.

Принцип:

```text
count
+
language code
↓
plural category
↓
localized template
```

Locale хранит формы, а код выбирает подходящую форму.

Обязателен универсальный fallback `other`.

Не следует писать отдельные plural rules вручную для каждого языка.

## Форматируемый Текст

Если текст содержит runtime-значения, Locale должен хранить шаблон, а не собранную строку.

Например:

```text
"{count} players"
"{current} of {total}"
```

Подстановка должна выполняться централизованными helper-ами или formatter-ами, когда форматирование становится сложнее простого случая.

Не смешивать business calculation и правила перевода в одном месте без необходимости.

## Reusable Components

Reusable component не должен содержать ненулевой user-facing linguistic default.

Плохо:

```ts
withDefaults(..., {
  text: 'Loading',
})
```

Плохо:

```vue
aria-label="Back"
```

Правильно:

```text
localized caller
↓
text / placeholder / aria label
↓
reusable component
```

Это относится не только к видимому тексту, но и к:

- placeholder;
- aria-label;
- accessibility description;
- empty state;
- error message;
- tooltip;
- alt, если изображение не декоративное.

Пустое значение допустимо, если отсутствие текста семантически корректно.

## Domain И Localization

Domain-модели не должны содержать переведённые пользовательские строки, если эти строки являются presentation.

Хорошее разделение:

```text
domain
→ stable identifiers and data

localization
→ user-facing representation
```

Это позволяет менять язык без пересоздания предметных сущностей и не связывает domain с конкретным набором переводов.

## Setup, Bootstrap И Features

Feature — не обязательно только экранный блок. Она может предоставлять переиспользуемую композицию нескольких app-систем.

Поэтому setup и bootstrap могут использовать feature API, когда feature:

- не привязана к конкретному route;
- не содержит узкосценарный screen flow;
- инкапсулирует полезную композицию store/shared/core;
- имеет понятную самостоятельную ответственность.

Направление зависимостей должно сохранять независимость базовых слоёв:

```text
setup / bootstrap
↓
reusable feature composition
↓
store + shared/core
```

При этом shared-инфраструктура не должна начинать зависеть от feature или store только ради удобства конкретного startup flow.

## Добавление Нового Текста

При добавлении пользовательского текста нужно:

1. определить его смысловую область;
2. обновить типизированный Locale contract;
3. добавить значение во все поддерживаемые Full Locale;
4. передать перевод до конечного UI consumer;
5. удалить старый hardcoded user-facing text;
6. проверить runtime language switch;
7. проверить accessibility text;
8. выполнить lint/build и профильные тесты.

Нельзя добавлять обязательный ключ только в один язык.

## Добавление Нового Языка

Новый Full Locale должен:

- быть зарегистрирован в поддерживаемых языках;
- полностью удовлетворять Locale contract;
- иметь корректный language code;
- иметь fallback display name;
- поддерживать используемые formatter/internationalization сценарии;
- корректно участвовать в initial resolution;
- корректно переключаться runtime;
- корректно работать с cache/versioning, если они используются.

Наличие Full Locale не означает, что для этого языка обязательно нужен отдельный Static Locale.

## Расширение Static Locale

Новый Static Locale нужен только тогда, когда есть реальная необходимость локализовать инфраструктурный UI до готовности Full Locale.

При расширении Static Locale нужно:

- реализовать полный Static Locale contract;
- сохранить default fallback;
- не переносить туда обычный экранный UI;
- проверить exact/base language resolution;
- проверить startup без доступного Full Locale.

## Антипаттерны

Нельзя:

- хранить переводы в domain models и technical constants;
- привязывать UI к конкретному transport или месту хранения переводов;
- дублировать Full Locale внутри Static Locale;
- использовать Static Locale как основной источник текстов после bootstrap;
- сохранять system-detected language как explicit user choice;
- активировать язык до успешной подготовки его Locale;
- реализовывать language-specific plural rules вручную;
- дублировать полный список названий языков в каждом Locale;
- оставлять hardcoded user-facing text в reusable components;
- маскировать нарушение Locale contract через silent fallback вроде пустой строки;
- переносить store-зависимую композицию в shared-инфраструктуру;
- считать сам факт зависимости setup/bootstrap от переиспользуемой feature архитектурной ошибкой.

## Ориентиры В Проекте

Для поиска реализации используются следующие области:

```text
src/app/shared/locale
src/app/shared/types/locale
src/app/stores/language
src/app/domain/lang
src/app/features/locale
src/app/features/settings
public/lang
```

Эти пути являются навигационными ориентирами, а не описанием обязательной внутренней реализации.
