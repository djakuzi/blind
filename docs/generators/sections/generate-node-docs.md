# Генератор версий документации

Подставляет актуальные версии из `package.json` в документацию.

| | |
|---|---|
| Скрипт | [generateDocsVersions.js](../../../scripts/generators/generateDocsVersions.js) |
| Команда | `npm run app:generate:docs-versions` |
| Источник | `dependencies`, `devDependencies`, `engines` в `package.json` |
| Обновляет | значения между маркерами в документах со стеком и требованиями |

## Маркеры

Версия в документе обёрнута в пару маркеров. Генератор меняет только значение между ними:

```md
<span hidden data-doc-marker="stack-example:start"></span>`Example 1.2.x`<span hidden data-doc-marker="stack-example:end"></span>
```

1. Версия из `package.json` приводится к короткому виду: `^1.2.3` → `Example 1.2.x`.
2. Список маркеров и документов задаётся в скрипте генератора.
3. Значение между маркерами руками не правится.

## Когда запускать

1. Изменились версии в `package.json`.
2. Добавлен новый маркер версии.

## Связанные разделы

- [Стек приложения](../../architecture/sections/stack.md) — документ, где используются эти маркеры.
