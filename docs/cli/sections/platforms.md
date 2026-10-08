# Platforms

| Команда | Назначение |
| --- | --- |
| `platform sync android` | Синхронизация Capacitor Android |
| `platform sync ios` | Синхронизация Capacitor iOS |
| `platform open android` | Открыть Android Studio |
| `platform open ios` | Открыть Xcode |
| `platform run android` | Запуск приложения через Capacitor |
| `platform run ios` | Запуск приложения через Capacitor |

Для `sync` и `run` укажите `--build`, чтобы предварительно собрать Web и выполнить синхронизацию. Необязательный `--mode debug|prod` применяется только вместе с `--build`.

```bash
npm run cli -- platform run android --build
npm run cli -- platform sync ios --build --mode debug
npm run cli -- platform open ios
```

Без `--build` используются существующие файлы сборки. Для iOS требуется macOS.
