# Electron в Blind

Правила — `docs/client/plugins/rules/electronPluginRule.md`. Запуск и сборка — `docs/client/projectSetup/sections/desktop.md`.

## Как устроено

- `electron/main/window.ts` — `BrowserWindow` с `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`, preload `preload.mjs`; полноэкранный режим по умолчанию.
- Production renderer грузится через собственный протокол `blind://app` (`electron/main/protocol/renderer.ts`), а не `file://`. В разработке — `VITE_DEV_SERVER_URL`.
- `electron/preload.ts` — `contextBridge.exposeInMainWorld(ELECTRON_CONFIG.bridgeKey, createElectronBridge())`. Bridge собирается из `preload.ts` каждого plugin.
- Каналы IPC — `createElectronChannel(plugin, action)` → `blind:<plugin>:<action>`.
- Renderer получает capability через `HelperBridge.getCapability('<name>')` (`src/core/platform/runtime/desktop/helpers/bridge.helper.ts`).

## Рецепт plugin (по образцу `electron/plugin/power`)

```
electron/plugin/<name>/
├── channel.ts   <NAME>_CHANNEL = { action: createElectronChannel('<name>', 'action') }
├── type.ts      iElectron<Name>Plugin — контракт для renderer
├── preload.ts   <Name>PreloadPlugin: методы → ipcRenderer.invoke(CHANNEL.action, …)
└── main.ts      register<Name>Plugin(): ipcMain.removeHandler + ipcMain.handle с валидацией
```

Затем:

1. `electron/main/plugins.ts` — вызвать `register<Name>Plugin()`.
2. `electron/preload/bridge.ts` — добавить `<name>: <Name>PreloadPlugin`.
3. Тип bridge в `electron/type` и `src/core/platform/runtime/desktop/type/bridge.type.ts` — синхронно.
4. Desktop adapter Tool — `HelperBridge.getCapability('<name>')`.

Принципы:

- `invoke`/`handle` для запрос-ответ; без generic «передать любой канал» в preload.
- Preload отдаёт узкий типизированный API, никогда не сырой `ipcRenderer` и не event-объекты.
- `ipcMain.removeHandler` перед `handle` — как в существующих plugins (повторная регистрация).
- Окно для операции — из `event.sender` (как в `view`, `system`), не глобальная переменная.

## Валидация в main process

Renderer считается недоверенным. Каждый аргумент проверяется в `main.ts`: тип, границы, допустимые значения.

Образец — `electron/plugin/filesystem/main.ts`: путь — строка без `\0`, не абсолютный, после `resolve` остаётся внутри каталога данных приложения (`isPathOutsideRoot`); данные — строка.

## Безопасность (официальный чеклист Electron, применительно к Blind)

| Пункт | Состояние в Blind |
|---|---|
| `contextIsolation: true` | ✅ |
| `sandbox: true` | ✅ |
| `nodeIntegration: false` | ✅ |
| Не отключать `webSecurity`, не включать `allowRunningInsecureContent`, experimental features, `enableBlinkFeatures` | ✅ не используются — так и держать |
| Собственный протокол вместо `file://` | ✅ `blind://` |
| Сырой `ipcRenderer` не выставлен в renderer | ✅ |
| Валидация аргументов IPC в main | ✅ filesystem; проверяй в каждом новом plugin |
| Проверка отправителя IPC (`event.senderFrame` — origin ожидаемый) | ⚠️ сейчас не проверяется — учитывай в новых privileged-операциях, предложи пользователю |
| Ограничение навигации (`will-navigate` с разбором URL) | ⚠️ не найдено — предложи пользователю |
| Запрет/ограничение новых окон (`setWindowOpenHandler`) | ⚠️ не найдено — предложи пользователю |
| Content Security Policy | ⚠️ нет CSP в `index.html` — предложи пользователю (учти dev-сервер Vite и Capacitor) |
| Обработчик запросов разрешений сессии (`setPermissionRequestHandler`) | ⚠️ не найден |
| `shell.openExternal` только с проверенными URL | не используется — если появится, только allowlist |
| Fuses (например, `runAsNode`) | не настроены — вопрос к релизной сборке |
| Актуальная версия Electron | сейчас 44.x — обновлять мажорные версии своевременно |

Пункты ⚠️ — наблюдения на момент сборки skill. Не исправляй их молча в рамках другой задачи: назови пользователю и предложи отдельное изменение.

## Проверка

- `npm run desktop:dev` — запуск; `npm run desktop:build` — типы и production-сборка.
- Проверь функцию в окне Electron, в полноэкранном и оконном режиме (выход из fullscreen меняет границы окна).
- Packaging (`desktop:package:*`) — по запросу; подпись и notarization не настроены.
