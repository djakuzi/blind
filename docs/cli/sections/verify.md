# Verify / Fix

| Проверка | Назначение |
| --- | --- |
| `verify format` | Prettier |
| `verify lint` | ESLint |
| `verify web` | TypeScript и Web build |
| `verify desktop` | TypeScript и Electron build |
| `verify generated` | Актуальность generated-файлов |
| `verify all` | Все проверки последовательно |

| Исправление | Назначение |
| --- | --- |
| `fix format` | Prettier с записью |
| `fix lint` | ESLint --fix |
| `fix all` | Оба исправления |

```bash
npm run cli -- verify all
npm run cli -- fix all
```

`verify` не запускает автоисправления, однако сборки создают выходные файлы. При ошибках `verify all` возвращает ненулевой код.
