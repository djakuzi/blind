# Build / Package

| Команда | Назначение |
| --- | --- |
| `build web debug` | Debug-сборка Web |
| `build web prod` | Production-сборка Web |
| `build desktop` | Сборка Electron |
| `build mobile android [debug|prod]` | Web-сборка и синхронизация Android |
| `build mobile ios [debug|prod]` | Web-сборка и синхронизация iOS |
| `package desktop [current|mac|win|linux]` | Упаковка Electron для соответствующей ОС |

```bash
npm run cli -- build web prod
npm run cli -- build mobile android debug
npm run cli -- package desktop current
```

Упаковка Desktop через CLI ограничена текущей ОС. Для остальных систем используйте существующий GitHub Actions workflow.
