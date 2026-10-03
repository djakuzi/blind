# Правила Electron plugins

Electron plugins используются для desktop-возможностей, которым нужен доступ к Electron main process или privileged API.

Обычно plugin находится в `electron/plugin/<name>` и может содержать:

- `channel.ts` — IPC channels;
- `main.ts` — privileged реализацию в main process;
- `preload.ts` — безопасный renderer facade;
- `type.ts` — контракт capability;
- `helpers` — внутренние части plugin, если они нужны.

Основные правила:

1. Electron plugin не должен дублировать полный Tool без необходимости.
2. В plugin выносится только та часть desktop-реализации, которой действительно нужен Electron boundary.
3. Tool остается владельцем публичного API, общей семантики и orchestration инструмента.
4. Renderer получает Electron capabilities через preload bridge, а platform Tool обращается к ним через desktop runtime bridge.
5. Прямой `ipcRenderer` не должен распространяться по `src`.
6. Входные данные privileged IPC должны проверяться на стороне main process.
7. Platform-specific security checks не заменяются общей валидацией Tool.
8. При изменении публичного plugin contract нужно синхронно обновлять его типы, bridge и связанную документацию.
