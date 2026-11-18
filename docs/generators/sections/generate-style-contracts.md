# Генератор style contracts

Создаёт TypeScript contracts для стилевых tokens, чтобы props компонентов принимали только существующие значения.

| | |
|---|---|
| Скрипт | [generateStyleContracts.js](../../../scripts/generators/generateStyleContracts.js) |
| Команда | `npm run app:generate:style-contracts` |
| Источник | `src/app/shared/styles/tokens/` — colors, typography, radius, spacing, padding, safearea, borders |
| Обновляет | `src/app/shared/styles/contracts/*.contract.ts` для этих tokens |

## Когда запускать

1. Изменились tokens.
2. Нужно восстановить contracts в актуальное состояние.

Contracts руками не правятся: меняются tokens, затем запускается генератор.
