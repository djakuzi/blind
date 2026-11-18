# Blind

Кроссплатформенная PvP-аркада для Web, Desktop, Android и iOS.

## Структура

| Папка | Что |
|---|---|
| `apps/client` | клиент: Vue 3, TypeScript, Vite, Capacitor, Electron |
| `docs` | документация: общие разделы и `docs/client` |
| `.ai-core` | skills для coding agents |

Каждое приложение собирается и запускается из своей папки.

## Быстрый старт клиента

Требуются Node.js >=22.12.0, npm и Git.

```bash
git clone https://github.com/djakuzi/blind.git
cd blind/apps/client
npm ci
npm run cli
```

Перед запуском настройте `.env.debug` и `.env.prod` по `.env.template` в `apps/client`. Для мобильных платформ нужны соответствующие SDK и локальные конфигурации.

Без CLI (из `apps/client`):

```bash
npm run dev
npm run desktop:dev
```

Подробнее: [развёртывание](./docs/client/projectSetup/index.md) · [запуск через CLI](./docs/client/projectSetup/sections/cli.md) · [справочник CLI](./docs/client/cli/index.md).

## Документация

Общая:

- [Работа над проектом](./CONTRIBUTING.md)
- [Процесс работы](./docs/workflow/index.md)
- [Агенты](./docs/agents/index.md)

Клиент:

- [Настройка проекта](./docs/client/settingsProject/index.md)
- [Код](./docs/client/code/index.md)
- [Архитектура](./docs/client/architecture/index.md)
- [Интерфейс](./docs/client/interface/index.md)
- [Аудио](./docs/client/audio/index.md)
- [Генераторы](./docs/client/generators/index.md)
- [Плагины](./docs/client/plugins/index.md)
- [CLI](./docs/client/cli/index.md)

[История изменений](./CHANGELOG.md)
