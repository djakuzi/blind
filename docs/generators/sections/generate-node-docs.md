# Генератор версий документации

## Описание
[Генератор версий документации](../../../scripts/generators/generateDocsVersions.js) является скриптом `npm run app:generate:docs-versions`, при запуске которого в документации обновляются актуальные версии из `package.json`.

## Источник данных

Источником истины являются поля `dependencies`, `devDependencies` и `engines` в `package.json`.

Пример:

```json
"dependencies": {
  "vue": "^3.5.39",
  "pinia": "^4.0.3",
  "vue-router": "^5.3.0"
},
"devDependencies": {
  "@vitejs/plugin-vue": "^6.0.7",
  "typescript": "~6.0.2",
  "vite": "^8.1.1"
},
"engines": {
  "node": ">=22.12.0"
}
```

## Как работает

Генератор:

1. читает `package.json`;
2. берет версии `Node.js` и ключевых пакетов стека;
3. ищет в документации фиксированные маркеры версий;
4. заменяет содержимое между ними на актуальные значения.

## Маркеры

Для разных версий используются свои маркеры, например:

- `node-version`
- `stack-vue`
- `setup-capacitor`
- `stack-typescript`
- `stack-vite`
- `stack-pinia`
- `stack-vue-router`
- `stack-plugin-vue`

Иллюстрация:

> `>=22.12.0`

Короткий пример:

1. В `package.json` указана версия `^3.5.39`.
2. Генератор преобразует ее в формат `Vue 3.5.x` для `stack.md`.
3. В документации обновляется только значение версии.

### Исходник `.md`

Пример строки в markdown-файле:

```md
1. <span hidden data-doc-marker="stack-vue:start"></span>`Vue 3.5.x`<span hidden data-doc-marker="stack-vue:end"></span> - UI-слой приложения.
```

## Запуск

```bash
npm run app:generate:docs-versions
```

## Когда использовать

Запускайте генератор после изменения версий в `package.json` или после добавления новых документируемых маркеров версий.
