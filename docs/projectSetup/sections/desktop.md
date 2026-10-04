# Запуск Desktop

Эта инструкция описывает запуск, production-сборку и создание desktop-дистрибутивов через Electron.

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

Она создает файлы приложения, но не готовый установщик.

## Шаг 4. Создание дистрибутива

Для текущей операционной системы:

```bash
npm run desktop:package
```

Для конкретной платформы:

```bash
npm run desktop:package:mac
npm run desktop:package:win
npm run desktop:package:linux
```

Готовые файлы сохраняются в:

```text
release/desktop
```

Форматы:

- macOS — `.dmg`, universal-сборка для Intel и Apple Silicon;
- Windows — `.exe` установщик NSIS для x64;
- Linux — `.AppImage` для переносимого запуска и `.deb` для Debian/Ubuntu x64.

Для стабильной сборки рекомендуется создавать дистрибутив на соответствующей операционной системе или использовать CI.

На macOS и Windows неподписанные сборки могут показывать системное предупреждение. Подписание и notarization настраиваются отдельно перед публичным релизом.


## GitHub Actions

Desktop-сборки также создаются через workflow `.github/workflows/desktop.yml`.

После того как workflow находится в default-ветке, его можно запустить вручную:

```text
GitHub → Actions → Desktop → Run workflow
```

Ручной запуск создает три artifacts:

- `blind-macos`;
- `blind-windows`;
- `blind-linux`.

Artifacts хранятся 14 дней.

При push тега формата `v*.*.*`, например:

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub собирает все три платформы и автоматически создает GitHub Release. Версия приложения для такой сборки берется из имени тега.
