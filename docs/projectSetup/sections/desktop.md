# Запуск Desktop

Запуск, сборка и дистрибутивы Electron-версии.

## Команды

| Команда | Что делает |
|---|---|
| `npm run desktop:dev` | запуск для разработки (по умолчанию на весь экран) |
| `npm run desktop:build` | проверка типов и production-сборка, без установщика |
| `npm run desktop:package` | установщик для текущей ОС |
| `npm run desktop:package:mac` / `:win` / `:linux` | установщик для конкретной ОС |

## Дистрибутивы

Результат — в `release/desktop`.

| ОС | Формат |
|---|---|
| macOS | `.dmg`, universal (Intel и Apple Silicon) |
| Windows | `.exe`, NSIS, x64 |
| Linux | `.AppImage` и `.deb`, x64 |

1. Надёжнее собирать на целевой ОС или в CI.
2. Неподписанные сборки на macOS и Windows показывают системное предупреждение. Подпись и notarization настраиваются перед публичным релизом.

## GitHub Actions

Workflow — `.github/workflows/desktop.yml`.

| Запуск | Результат |
|---|---|
| вручную: Actions → Desktop → Run workflow (из default-ветки) | artifacts для трёх ОС, хранятся 14 дней |
| push тега `v*.*.*` | сборка трёх ОС и GitHub Release, версия — из тега |
