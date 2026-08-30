# Game Blind

blind - the game

## Разделы

- [Разворачивание проекта](./docs/projectSetup/index.md)
- [Настройка проекта](./docs/settingsProject/index.md)
- [Работа в проекте(CONTRIBUTING)](CONTRIBUTING.md)
- [Архетектура](./docs/architecture/index.md)
- [Плагины](./docs/plugins/index.md)
- [Генераторы](./docs/generators/index.md)

## История изменений

Подробности в файле [CHANGELOG.md](CHANGELOG.md)

## Настройка конфигурации

См. [Документацию по конфигурации Vite](https://vite.dev/config/).

## Рекомендации

### IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (отключите Vetur).

### Браузер

- Браузеры на основе Chromium (Chrome, Edge, Brave и др.):
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Включить Custom Object Formatter в Chrome DevTools](http://bit.ly/object-formatters)

### Поддержка типов для импортов `.vue` в TS

TypeScript по умолчанию не может обрабатывать информацию о типах для импортов `.vue`, поэтому мы заменяем CLI `tsc` на `vue-tsc` для проверки типов. В редакторах необходимо установить [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar), чтобы языковой сервис TypeScript распознавал типы `.vue`.
