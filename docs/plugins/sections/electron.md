# Electron plugins

Electron plugins используются для desktop-возможностей, которым нужен доступ к Electron main process или privileged API.

Plugin находится в `electron/plugin/<name>`.

Обычно plugin содержит:

- `channel.ts` — IPC channels;
- `main.ts` — privileged реализацию в main process;
- `preload.ts` — безопасный renderer facade;
- `type.ts` — контракт capability;
- `helpers` — внутренние части plugin, если они нужны.

Renderer получает Electron capabilities через preload bridge. Platform Tool обращается к ним через desktop runtime bridge.

Основные правила:

- Electron plugin не должен дублировать полный Tool без необходимости;
- в plugin выносится только та часть desktop-реализации, которой действительно нужен Electron boundary;
- Tool остается владельцем публичного API, общей семантики и orchestration инструмента;
- прямой `ipcRenderer` не должен распространяться по `src`;
- входные данные privileged IPC должны проверяться на стороне main process;
- platform-specific security checks не заменяются общей валидацией Tool.

Текущие Electron plugins: Audio, Filesystem, Storage и View.
