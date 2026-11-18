# Запуск на Android

Запуск через Capacitor и Android Studio.

1. Установить зависимости:

```bash
npm install
```

2. Собрать web-часть (`npm run build:debug` — debug-сборка):

```bash
npm run build
```

3. Синхронизировать Capacitor:

```bash
npx cap sync android
```

4. Открыть проект в Android Studio:

```bash
npx cap open android
```

5. Выбрать эмулятор или подключённое устройство и нажать **Run**.

## Связанные разделы

- [Разворачивание проекта](../index.md) — версии Android Studio, JDK и SDK, без которых сборка не пройдёт.
