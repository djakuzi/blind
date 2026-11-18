# Правила Electron plugins

Как выносить desktop-возможности, которым нужен main process или privileged API.

## Структура

`electron/plugin/<name>/`:

| Файл | Назначение |
|---|---|
| `channel.ts` | IPC-каналы |
| `main.ts` | реализация в main process |
| `preload.ts` | безопасный API для renderer |
| `type.ts` | контракт возможности |
| `helpers/` | внутренние части, если нужны |

## Правила

1. В plugin выносится только то, что требует Electron boundary. Полный API Tool не дублируется.
2. Tool остаётся владельцем API, семантики и orchestration.
3. Renderer получает возможность через preload bridge, Tool — через desktop runtime bridge.
4. `ipcRenderer` не используется в `src`.
5. Входные данные IPC проверяются в main process.
6. Платформенные проверки безопасности не заменяются общей валидацией Tool.
7. Изменился контракт plugin — синхронно обновляются типы, bridge и документация.

## Связанные разделы

- [Архитектура core-слоя](../../architecture/sections/core-flow.md) — как Tool и desktop adapter обращаются к plugin.
