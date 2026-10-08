# Generate

| Команда | Назначение |
| --- | --- |
| `generate styles` | Style contracts |
| `generate icons` | Реестр иконок |
| `generate audio` | Реестр аудио |
| `generate fonts` | TTF → WOFF2 |
| `generate docs` | Версии в документации |
| `generate all` | Запуск всех генераторов |
| `generate check` | Сравнение с результатом повторной генерации |

```bash
npm run cli -- generate all
npm run cli -- generate check
```

`generate check` запускает генераторы во временной копии проекта; для работы нужны `node_modules`. Исходные generated-файлы команда не перезаписывает.
