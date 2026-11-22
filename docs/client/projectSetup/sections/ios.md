# Запуск на iOS

Запуск через Capacitor и Xcode (только macOS).

1. Установить зависимости:

```bash
npm ci
```

2. Собрать web-часть (`npm run build:debug` — debug-сборка):

```bash
npm run build
```

3. Синхронизировать Capacitor:

```bash
npx cap sync ios
```

4. Открыть проект в Xcode (`ios/App/App.xcodeproj`):

```bash
npx cap open ios
```

5. Выбрать симулятор или подключённое устройство и нажать **Run**.

## Связанные разделы

- [Разворачивание проекта](../index.md) — требования к Xcode и аккаунту разработчика.
