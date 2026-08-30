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

Пример использования маркера в `.md` файле:

```md
`Node.js` `<!-- node-version:start -->>=22.12.0<!-- node-version:end -->`
```

Генератор обновляет только текст между `start` и `end`, не затрагивая остальную строку документации.

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
