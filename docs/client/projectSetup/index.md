# Разворачивание проекта

Что нужно для разработки и запуска клиента на Web, Android, iOS и Desktop. Все команды выполняются из `apps/client`.

## Требования

### Общие

1. Node.js <span hidden data-doc-marker="node-version:start"></span>`>=22.12.0`<span hidden data-doc-marker="node-version:end"></span> и npm из его поставки.
2. Git.

### Android

| Что | Версия |
|---|---|
| Android Studio | от 2025.1.3 |
| JDK | 21 (проект собирается с Java 21) |
| Android Gradle Plugin | 8.13.0 |
| Gradle | 8.14.3 |
| Android SDK Platform | 36 |
| Android SDK Build Tools | 35.0.0+ |
| Устройство или эмулятор | Android 8.0 (API 26)+ |

`adb` — для запуска на подключённом устройстве.

### iOS

1. macOS и Xcode с поддержкой deployment target iOS 15.0.
2. Зависимости подключаются через Swift Package Manager — CocoaPods не нужен.
3. Apple Developer аккаунт — для запуска на реальном устройстве.

### Desktop

Отдельный SDK не нужен: Electron ставится с зависимостями проекта.

### Версии ключевых пакетов

Обновляются генератором, руками не правятся:

- <span hidden data-doc-marker="setup-vue:start"></span>`Vue 3.5.39`<span hidden data-doc-marker="setup-vue:end"></span>
- <span hidden data-doc-marker="setup-capacitor:start"></span>`Capacitor 8.5.0`<span hidden data-doc-marker="setup-capacitor:end"></span>
- <span hidden data-doc-marker="setup-vite:start"></span>`Vite 8.1.1`<span hidden data-doc-marker="setup-vite:end"></span>
- <span hidden data-doc-marker="setup-pinia:start"></span>`Pinia 4.0.3`<span hidden data-doc-marker="setup-pinia:end"></span>
- <span hidden data-doc-marker="setup-vue-router:start"></span>`vue-router 5.3.0`<span hidden data-doc-marker="setup-vue-router:end"></span>

## Подготовка

1. Заполнить `.env.debug` и `.env.prod` по `.env.template` в `apps/client` — [переменные окружения](../settingsProject/sections/env.md).
2. Для мобильных платформ — [нативные настройки](../settingsProject/sections/property.md).

## Запуск

- [Через CLI](./sections/cli.md) — быстрый способ для всех платформ.
- Вручную: [Web](./sections/web.md), [Android](./sections/android.md), [iOS](./sections/ios.md), [Desktop](./sections/desktop.md).
