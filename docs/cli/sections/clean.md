# Clean

| Команда | Что удаляется |
| --- | --- |
| `clean web` | `dist/` |
| `clean desktop` | `dist-electron/` |
| `clean release` | `release/desktop/` |
| `clean cache` | Известные кеши в `node_modules/` |
| `clean dependencies` | `node_modules/` |
| `clean reinstall` | `node_modules/`, затем `npm ci` |

```bash
npm run cli -- clean web --dry-run
npm run cli -- clean web
npm run cli -- clean reinstall --yes
```

`--dry-run` показывает цели без удаления. Без `--yes` требуется подтверждение в терминале. Используйте `--yes` только при осознанном запуске без подтверждений.
