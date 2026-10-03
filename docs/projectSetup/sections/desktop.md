# Запуск Desktop

Эта инструкция описывает запуск desktop-версии через Electron.

## Шаг 1. Подготовьте проект

Если зависимости еще не установлены, установите их в корне `blind`:

```bash
npm install
```

## Шаг 2. Запуск в режиме разработки

```bash
npm run desktop:dev
```

Electron-приложение запускается в полноэкранном режиме по умолчанию.

## Шаг 3. Production-сборка

```bash
npm run desktop:build
```

Команда выполняет проверку TypeScript и production-сборку desktop-версии.
