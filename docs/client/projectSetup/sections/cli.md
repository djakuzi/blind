# Быстрый запуск через CLI

Установка и запуск проекта через встроенный CLI.

## 1. Подготовка

Нужны Node.js и Git; для Android — Android Studio и SDK, для iOS — macOS и Xcode ([все требования](../index.md)).

```bash
git clone https://github.com/djakuzi/blind.git
cd blind/apps/client
npm ci
```

Заполнить `.env.debug` и `.env.prod` по `.env.template` в `apps/client`. Для мобильных платформ — [нативные настройки](../../settingsProject/sections/property.md).

## 2. Проверка окружения

```bash
npm run cli -- project doctor
```

Для конкретной платформы: `project doctor android` или `project doctor ios`.

## 3. Запуск

```bash
npm run cli
```

Без меню:

| Платформа | Команда |
|---|---|
| Web | `npm run cli -- dev web` |
| Desktop | `npm run cli -- dev desktop` |
| Android | `npm run cli -- platform run android --build` |
| iOS (macOS) | `npm run cli -- platform run ios --build` |

Через IDE: `platform sync <android|ios> --build`, затем `platform open <android|ios>`.

## Связанные разделы

- [CLI](../../cli/index.md) — все команды и флаги.
