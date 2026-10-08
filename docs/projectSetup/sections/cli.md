# Быстрый запуск проекта через CLI

## 1. Подготовка

Установите Node.js >=22.12.0 и Git. Для Android понадобятся Android Studio и SDK, для iOS — macOS и Xcode. [Все требования](../index.md).

```bash
git clone https://github.com/djakuzi/blind.git
cd blind
npm ci
```

Создайте и заполните `.env.debug` и `.env.prod` по `.env.template`. Для мобильных платформ подготовьте [локальные нативные настройки](../../settingsProject/sections/property.md).

## 2. Проверка окружения

```bash
npm run cli -- project doctor
npm run cli -- project doctor android
npm run cli -- project doctor ios
```

Проверку Android или iOS выполняйте только для нужной платформы.

## 3. Запуск

```bash
npm run cli
```

В меню выберите нужную команду. Быстрые варианты без меню:

| Платформа | Команда |
| --- | --- |
| Web | `npm run cli -- dev web` |
| Desktop | `npm run cli -- dev desktop` |
| Android | `npm run cli -- platform run android --build` |
| iOS (macOS) | `npm run cli -- platform run ios --build` |

Для запуска через IDE: `platform sync android --build` → `platform open android` (или аналогично для `ios`). Подключите устройство либо используйте эмулятор.

Все команды: [справочник Blind CLI](../../cli/index.md). Ручные способы запуска: [Web](web.md), [Desktop](desktop.md), [Android](android.md), [iOS](ios.md).
