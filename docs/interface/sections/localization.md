# Локализация интерфейса

Локализация в `blind` разделена на две разные системы:

```text
Static Locale
≠
Full Locale
```

Это главный архитектурный принцип. Static Locale нужен только для минимального инфраструктурного UI до загрузки основного Locale. Full Locale является основным источником пользовательских текстов приложения после bootstrap.

## Слои

### Static Locale

Static Locale находится в:

```text
src/app/shared/locale/
```

Сейчас слой включает:

```text
locale.registry.ts
locale.helper.ts
locale.type.ts
useStaticLocale.ts
```

Это маленький встроенный в bundle registry. Он:

- поставляется вместе с кодом;
- не требует HTTP;
- не требует Filesystem cache;
- не требует загруженного language manifest;
- работает во время bootstrap;
- имеет собственный default fallback;
- не является вторым полноценным переводом всего приложения.

Static Locale содержит только текст, необходимый до доступности Full Locale или при критической инфраструктурной загрузке.

Пример текущей структуры:

```text
STATIC_LOCALE_REGISTRY
├── en
│   └── loading
└── ru
    └── loading
```

Сейчас туда относятся:

```text
loading.base
loading.language
```

Обычные разделы приложения нельзя переносить в Static Locale:

```text
views
game
settings
connectionTypes
```

### Full Locale

Full Locale является основным языком интерфейса после успешного bootstrap.

Текущие bundled источники:

```text
public/lang/languages.json
public/lang/en.json
public/lang/ru.json
```

Текущий transport:

```text
ApiLanguage
↓
publicClient
```

В будущем источник manifest или locale-файлов может быть заменен или расширен remote API, но UI и domain не должны зависеть от конкретного transport. Сейчас production backend для локализации не описывается как реализованный.

## Static Locale Resolution

Static Locale выбирается по language code:

```text
language code
↓
normalize
↓
exact
↓
base
↓
STATIC_LOCALE_DEFAULT_LANGUAGE
```

Примеры:

```text
ru-RU → ru
ru_BY → ru
en-US → en
de-DE → fallback en
null → fallback en
```

`STATIC_LOCALE_DEFAULT_LANGUAGE = 'en'` является инфраструктурным fallback для embedded registry. Это не означает, что основной Locale приложения всегда должен быть английским.

Если Full Locale существует для `de`, но static `de` отсутствует:

```text
bootstrap static text → fallback en
после initialize → полноценный de UI
```

Это допустимо.

## Full Locale Contract

Текущая root-структура:

```text
Locale
├── common
├── views
├── settings
├── game
└── connectionTypes
```

### common

`common` содержит глобальные UI-тексты, которые не принадлежат одному screen.

Пример:

```text
common.navigation.back
```

### views

`views` содержит тексты конкретных route/view.

Правило структуры:

```text
views
→ view
→ subview
→ ui / modals
```

Примеры:

```text
views.settings.index.ui
views.settings.index.modals.changeLanguage

views.preGame.index.ui
views.preGame.typeConnection.ui
```

### settings

`settings` содержит локализованные значения глобальных настроек.

Примеры:

```text
settings.theme.system
settings.theme.light
settings.theme.dark

settings.scale.small
settings.scale.default
settings.scale.large
```

Важно различать название настройки и значение настройки:

```text
views.settings.index.ui.theme
→ название строки UI: "App theme"

settings.theme.dark
→ значение настройки: "Dark"
```

### game

`game` содержит локализованное presentation-представление игровых сущностей и format templates.

Примеры:

```text
game.modes.DUEL.title
game.modes.DUEL.description

game.format.players
game.format.rounds
```

### connectionTypes

`connectionTypes` содержит локализованное presentation-представление технических connection keys:

```text
BLUETOOTH
LAN
ONLINE
```

Технические identifiers не должны содержать локализованный текст.

## Domain Data И Presentation

Domain/config data и translated presentation разделены.

Например:

```text
public/game/gameModes.json
```

содержит технические данные режима:

```text
key
img
options
typeConnection
```

А:

```text
public/lang/<code>.json
```

содержит пользовательское представление:

```text
title
description
```

Не помещать русский или английский пользовательский текст в:

```text
ModelGameMode
TYPE_CONNECTION
game config
domain models
technical constants
```

## Language Manifest

`public/lang/languages.json` описывает доступные Full Locale.

`ModelLanguage` использует поля:

```text
key
name
img
version
isDefault
```

`key` - BCP-like language identifier, например `en` или `ru`. Он может использоваться для:

```text
Intl.PluralRules
Intl.DisplayNames
document.documentElement.lang
locale lookup
```

`name` - native/fallback название языка, например `English` или `Русский`. Это не обязательно текст, который отображается пользователю при другом UI language.

`img` - опциональное изображение или флаг.

`version` - версия locale-файла для cache invalidation.

`isDefault` - fallback основной системы языков. В manifest должен быть корректный default.

## Lifecycle

### До Mount

`setupLanguage` не загружает Full Locale. Он только определяет preferred language:

```text
language-selected-code из Preferences
↓ если отсутствует
system language через ToolSystem
↓
preferredLanguageCode
```

Автоматически определенный system language не должен записываться как explicit user choice.

Storage key:

```text
language-selected-code
```

предназначен для явного выбора пользователя.

### Bootstrap

После mount bootstrap загружает основной язык:

```text
load languages
↓
resolve preferred/default
↓
load locale
↓
apply currentLanguage
↓
apply locale
↓
isInitialized = true
↓
<html lang>
```

Invariant:

```text
isInitialized === true
```

означает, что должны существовать:

```text
currentLanguage
locale
languages
```

Не использовать `isInitialized = true` с `null` locale или `null` currentLanguage.

App bootstrap flow:

```text
main.ts
↓
setupLanguage()
↓
preferredLanguageCode
↓
prepareAppBootstrap()
↓
getStaticLocale(preferredLanguageCode)
↓
loader title = staticLocale.loading.language
↓
mount App
↓
ProviderLoaderApp visible
↓
runAppBootstrap()
↓
languageStore.initializeLanguage()
↓
Full Locale available
↓
app-bootstrap/language = loaded
↓
RouterView
```

Loader использует Static Locale, потому что Full Locale в этот момент еще загружается. Bootstrap UI не может зависеть от Full Locale.

## Storage И Cache

Preferences используются для небольших persistent metadata.

Сейчас:

```text
language-selected-code
language-list
```

`language-selected-code` хранит явный выбор пользователя.

`language-list` хранит cached language manifest fallback.

Locale cache хранится отдельно:

```text
lang/<code>.json
```

Формат:

```text
version
locale
```

Flow:

```text
manifest language.version
↓
Filesystem cached locale
↓
version совпадает?
├── да → cached locale
└── нет → load source → save new version
```

## setLanguage

`setLanguage(code)` работает как atomic-like flow:

```text
resolve supported language
↓
load target Locale
↓
persist explicit selected code
↓
preferredLanguageCode
↓
currentLanguage
↓
locale
↓
<html lang>
```

Главный принцип: не переключать текущий UI на target language до успешной загрузки target locale.

После успешной смены reactive consumers должны обновиться без reload приложения.

## Settings Language Names

Список языков приходит из manifest. Отображаемое название языка желательно показывать на текущем языке UI:

```text
UI = en
ru → Russian

UI = ru
en → английский
```

Для этого используется:

```text
Intl.DisplayNames
```

Fallback:

```text
ModelLanguage.name
```

Не хранить mapping всех названий языков внутри каждого locale-файла:

```text
settings.languages.en
settings.languages.ru
settings.languages.de
```

Это плохо масштабируется.

## Pluralization

Для выбора plural category используется:

```text
Intl.PluralRules
```

Не использовать самописные правила конкретного языка.

Locale хранит templates:

```text
one
few
many
other
```

Пример RU:

```json
{
  "one": "{count} игрок",
  "few": "{count} игрока",
  "many": "{count} игроков",
  "other": "{count} игроков"
}
```

Пример EN:

```json
{
  "one": "{count} player",
  "other": "{count} players"
}
```

`other` является обязательным fallback.

TypeScript не должен содержать специальных plural rules для русского, английского, немецкого, китайского и других языков.

## Reusable Components

Reusable component не должен содержать ненулевой user-facing linguistic default.

Плохо:

```ts
text?: string

withDefaults(..., {
  text: 'Загрузка',
})
```

Плохо:

```ts
accessibilityLabel: 'Слайдер'
```

Плохо для generic/reusable компонента:

```vue
aria-label="Назад"
```

Правильно:

```text
локализованный caller
↓
передаёт text/label/aria-label
↓
reusable component только отображает
```

Optional text prop допустим, если отсутствие текста является валидным состоянием.

Декоративный `alt=""` не является нарушением этого правила.

Пользовательские ARIA strings являются частью локализации так же, как visible UI text.

## Добавление Нового Текста

Checklist:

1. Определить правильный раздел:
   - `common`;
   - `views`;
   - `settings`;
   - `game`;
   - `connectionTypes`.
2. Обновить TypeScript contract в:
   ```text
   src/app/shared/types/locale
   ```
3. Добавить ключ во все поддерживаемые Full Locale-файлы.
4. Проверить одинаковую structural schema.
5. Обновить consumer.
6. Убрать старый hardcoded text.
7. Проверить runtime language switch.
8. Выполнить lint/build.

Не добавлять ключ только в один язык.

## Добавление Нового Full Locale

Checklist для `de`:

1. Добавить запись в:
   ```text
   public/lang/languages.json
   ```
2. Добавить:
   ```text
   public/lang/de.json
   ```
3. Locale должен полностью соответствовать `Locale` contract.
4. Добавить image при необходимости.
5. Указать корректный `version`.
6. Проверить `Intl.PluralRules('de')`.
7. Проверить `Intl.DisplayNames`.
8. Проверить initial system-language resolution.
9. Проверить explicit selection.
10. Проверить runtime switch.
11. Проверить filesystem cache/version.
12. Проверить `<html lang="de">`.

Добавлять язык в `STATIC_LOCALE_REGISTRY` не обязательно.

## Добавление Static Locale

Checklist:

1. Добавить ключ в:
   ```text
   STATIC_LOCALE_REGISTRY
   ```
2. Реализовать все поля `iStaticLocale`.
3. Не добавлять туда обычный UI.
4. Проверить exact/base resolution.
5. Проверить bootstrap без Full Locale.

## Антипаттерны

Нельзя:

- хранить пользовательский текст в domain models;
- хранить переводы в technical constants;
- делать hardcoded Russian/English text в reusable components;
- дублировать Full Locale в static registry;
- использовать static registry для обычных screens;
- сохранять system-detected language как explicit user choice;
- реализовывать plural rules вручную;
- хранить список названий всех языков в каждом locale;
- переключать current locale до успешной загрузки target locale;
- создавать silent `?? ''` для route UI, если bootstrap гарантирует initialized Locale;
- завязывать bootstrap на feature-level localization code.
