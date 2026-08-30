# Генератор версии Node.js для документации

## Описание
[Генератор версии Node.js](../../../scripts/generators/generateNodeDocs.js) является скриптом `npm run app:generate:node-docs`, при запуске которого в документации обновляется актуальная минимальная версия `Node.js` из `package.json`.

## Источник данных

Источником истины является поле `engines.node` в `package.json`.

Пример:

```json
"engines": {
  "node": ">=22.12.0"
}
```

## Как работает

Генератор:

1. читает `package.json`;
2. берет значение из `engines.node`;
3. ищет в `docs/**/*.md` маркеры нужного типа;
4. заменяет содержимое между маркерами на актуальную версию `Node.js`.

## Маркеры

По умолчанию используется маркер `node-version`.

Маркер ставится вокруг отображаемого значения версии `Node.js`, а в preview остается видна только сама версия.

Иллюстрация:

> `>=22.12.0`

Короткий пример:

1. В `package.json` указана версия `>=22.12.0`.
2. Генератор находит маркер `node-version`.
3. В документации обновляется только значение версии.

### Исходник `.md`

Пример строки в markdown-файле:

```md
1. `Node.js` версии <span hidden data-doc-marker="node-version:start"></span>`>=22.12.0`<span hidden data-doc-marker="node-version:end"></span>.
```

## Запуск

Стандартный запуск:

```bash
npm run app:generate:node-docs
```

Запуск с переопределением маркера:

```bash
npm run app:generate:node-docs -- -m node-version
```

Также можно использовать длинный флаг:

```bash
npm run app:generate:node-docs -- --marker node-version
```

## Обратная совместимость

Дополнительно в `package.json` сохранен алиас:

```bash
npm run generate:node-docs
```

Он проксирует вызов в основную команду `npm run app:generate:node-docs`.

## Когда использовать

Запускайте генератор после изменения `engines.node` в `package.json` или после добавления новых markdown-файлов с таким же маркером.
