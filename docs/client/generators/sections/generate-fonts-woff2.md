# Генератор WOFF2-шрифтов

Конвертирует исходные `.ttf`-шрифты в `.woff2`.

| | |
|---|---|
| Скрипт | [generateFontsWoff2.js](../../../../apps/client/scripts/generators/generateFontsWoff2.js) |
| Команда | `npm run app:generate:fonts-woff2` |
| Источник | все `.ttf` в `src/assets/fonts/` (рекурсивно) |
| Создаёт | `.woff2` рядом с каждым `.ttf` |

## Когда запускать

1. Добавлен, заменён или изменён `.ttf`.
2. Нужно восстановить `.woff2`.
