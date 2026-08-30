# Разворачивание проекта

Раздел описывает базовую подготовку `blind` к локальной разработке и запуску на web, Android и iOS.

## Требования

### Базовое окружение

1. `Node.js` <span hidden data-doc-marker="node-version:start"></span>`>=22.12.0`<span hidden data-doc-marker="node-version:end"></span>.
2. `npm`, который идет вместе с поддерживаемым `Node.js` и умеет ставить зависимости проекта.
3. `Git` любой актуальной стабильной версии.

### Для Android

1. `Android Studio` минимально от `2025.1.3`:
2. `JDK 17+`.
3. `Android Gradle Plugin 8.13.0`.
4. `Gradle 8.14.3`.
5. `Android SDK Platform 36`.
6. `Android SDK Build Tools 35.0.0+`.
7. `adb`, если нужен запуск на подключенном устройстве.
8. Устройство или эмулятор с `Android 8.0 (API 26)+`.

### Для iOS

1. `macOS`.
2. `Xcode`, который с поддержкой `iOS 15.0` как deployment target.
3. `CocoaPods`.
4. `Swift 5.0` support в выбранной версии `Xcode`.
5. `Apple Developer` аккаунт, если нужен запуск на реальном устройстве.

### Дополнительно

Проект использует:

- <span hidden data-doc-marker="setup-vue:start"></span>`Vue 3.5.39`<span hidden data-doc-marker="setup-vue:end"></span>;
- `Capacitor 8.2.0`;
- <span hidden data-doc-marker="setup-vite:start"></span>`Vite 8.1.1`<span hidden data-doc-marker="setup-vite:end"></span>;
- <span hidden data-doc-marker="setup-pinia:start"></span>`Pinia 4.0.3`<span hidden data-doc-marker="setup-pinia:end"></span>;
- <span hidden data-doc-marker="setup-vue-router:start"></span>`vue-router 5.3.0`<span hidden data-doc-marker="setup-vue-router:end"></span>.

## Настройка окружения

Перед запуском проекта нужно подготовить локальный файл окружения `.env`.

1. Скопировать шаблон окружения:

```bash
cp .env.template .env
```

2. Заполнить значения в `.env`. Возможно потребуются запрос данных для заполнения.

Подробный список переменных и рекомендации по их заполнению находятся здесь [настройка окружения](../settingsProject/sections/env.md)

3. Так же стоит обратить внимание на заполнение нативных переменных [нативная настройка окружения](../settingsProject/sections/property.md)


## Ручной запуск

- [Браузер](./sections/web.md)
- [Android](./sections/android.md)
- [iOS](./sections/ios.md)
