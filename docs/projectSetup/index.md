# Разворачивание проекта

Раздел описывает базовую подготовку `blind` к локальной разработке и запуску на Web, Android, iOS и Desktop.

## Требования

### Базовое окружение

1. `Node.js` <span hidden data-doc-marker="node-version:start"></span>`>=22.12.0`<span hidden data-doc-marker="node-version:end"></span>.
2. `npm`, который идет вместе с поддерживаемым `Node.js` и умеет ставить зависимости проекта.
3. `Git` любой актуальной стабильной версии.

### Для Android

1. `Android Studio` минимально от `2025.1.3`.
2. `JDK 17+`.
3. `Android Gradle Plugin 8.13.0`.
4. `Gradle 8.14.3`.
5. `Android SDK Platform 36`.
6. `Android SDK Build Tools 35.0.0+`.
7. `adb`, если нужен запуск на подключенном устройстве.
8. Устройство или эмулятор с `Android 8.0 (API 26)+`.

### Для iOS

1. `macOS`.
2. `Xcode` с поддержкой `iOS 15.0` как deployment target.
3. `CocoaPods`.
4. `Swift 5.0` support в выбранной версии `Xcode`.
5. `Apple Developer` аккаунт, если нужен запуск на реальном устройстве.

### Для Desktop

Дополнительный SDK не требуется. Electron устанавливается вместе с зависимостями проекта.

### Дополнительно

Проект использует:

- <span hidden data-doc-marker="setup-vue:start"></span>`Vue 3.5.39`<span hidden data-doc-marker="setup-vue:end"></span>;
- <span hidden data-doc-marker="setup-capacitor:start"></span>`Capacitor 8.5.0`<span hidden data-doc-marker="setup-capacitor:end"></span>;
- <span hidden data-doc-marker="setup-vite:start"></span>`Vite 8.1.1`<span hidden data-doc-marker="setup-vite:end"></span>;
- <span hidden data-doc-marker="setup-pinia:start"></span>`Pinia 4.0.3`<span hidden data-doc-marker="setup-pinia:end"></span>;
- <span hidden data-doc-marker="setup-vue-router:start"></span>`vue-router 5.3.0`<span hidden data-doc-marker="setup-vue-router:end"></span>.

## Настройка окружения

Перед запуском проекта нужно подготовить файлы окружения `.env.debug` и `.env.prod`.

1. Заполнить значения в `.env.debug` и `.env.prod`. Возможно потребуется запрос данных для заполнения.

Подробный список переменных и рекомендации по их заполнению находятся здесь: [настройка окружения](../settingsProject/sections/env.md).

2. Также стоит обратить внимание на [нативную настройку окружения](../settingsProject/sections/property.md).

## Запуск через CLI

[Краткая инструкция по установке и запуску](./sections/cli.md) · [Справочник команд](../cli/index.md).

## Ручной запуск

- [Браузер](./sections/web.md)
- [Android](./sections/android.md)
- [iOS](./sections/ios.md)
- [Desktop](./sections/desktop.md)
