# Генератор style contracts

## Описание

[Генератор style contracts](../../../scripts/generators/generateStyleContracts.js) запускается через команду `npm run app:generate:style-contracts`.

Генератор формирует contract-файлы для стилевых токенов проекта и поддерживает их в синхронизации с `src/app/styles/tokens/*`.

## Source of truth

Источником данных для генератора являются:

- `src/app/styles/tokens/colors.css`
- `src/app/styles/tokens/typography.css`
- `src/app/styles/tokens/radius.css`
- `src/app/styles/tokens/spacing.css`
- `src/app/styles/tokens/padding.css`
- `src/app/styles/tokens/safearea.css`
- `src/app/styles/tokens/borders.css`

Если нужно изменить доступные tokens или типы для props, сначала меняются соответствующие файлы в `tokens`, а затем повторно запускается генератор.

## Что обновляет генератор

Генератор обновляет следующие файлы:

- `src/app/styles/contracts/color.contract.ts`
- `src/app/styles/contracts/fontSize.contract.ts`
- `src/app/styles/contracts/fontWeight.contract.ts`
- `src/app/styles/contracts/radius.contract.ts`
- `src/app/styles/contracts/space.contract.ts`
- `src/app/styles/contracts/padding.contract.ts`
- `src/app/styles/contracts/safeArea.contract.ts`
- `src/app/styles/contracts/border.contract.ts`

## Когда использовать

Генератор нужно запускать, если:

- изменились токены в `src/app/styles/tokens/*`;
- нужно пересобрать contracts после правок дизайн-системы;
- нужно восстановить contract-файлы в актуальное состояние.

## Важное правило

Файлы, которые обновляет генератор, не должны редактироваться вручную.

Если нужно изменить их содержимое, сначала нужно изменить source of truth в `tokens`, а затем снова запустить:

```bash
npm run app:generate:style-contracts
```
