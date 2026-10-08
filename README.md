# Blind

Кроссплатформенная локальная PvP-аркада для Web, Desktop, Android и iOS.

**Стек:** Vue 3, TypeScript, Vite, Capacitor, Electron.

## Быстрый старт

Требуются Node.js >=22.12.0, npm и Git.

```bash
git clone https://github.com/djakuzi/blind.git
cd blind
npm ci
npm run cli
```

Перед запуском настройте `.env.debug` и `.env.prod` по `.env.template`. Для мобильных платформ дополнительно нужны соответствующие SDK и локальные конфигурации.

Без CLI:

```bash
npm run dev
npm run desktop:dev
```

Подробнее: [развёртывание](docs/projectSetup/index.md) · [запуск через CLI](docs/projectSetup/sections/cli.md) · [справочник CLI](docs/cli/index.md).

## Документация

- [Настройка проекта](docs/settingsProject/index.md)
- [Работа над проектом](CONTRIBUTING.md)
- [Архитектура](docs/architecture/index.md)
- [CLI](docs/cli/index.md)
- [Плагины](docs/plugins/index.md)
- [Генераторы](docs/generators/index.md)
- [Интерфейс](docs/interface/index.md)
- [Аудио](docs/audio/index.md)
- [История изменений](CHANGELOG.md)
