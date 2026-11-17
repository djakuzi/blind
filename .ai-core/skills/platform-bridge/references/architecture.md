# Архитектура platform-слоя на практике

Правила — `docs/architecture/sections/core-flow.md`. Здесь — как они выглядят в коде.

## Карта

```
src/core/platform/
├── adapter/            resolveRuntimeAdapter({ web, mobile, desktop }) — выбор реализации
├── runtime/            определение среды: getRuntime(), getPlatform(), isWeb/isMobile/isDesktop
│   ├── desktop/        HelperBridge (доступ к Electron bridge), типы bridge
│   ├── mobile/         определение Capacitor-среды
│   ├── web/
│   └── shared/         общие helpers среды
├── tool/<name>/        публичные инструменты
└── type.ts             iPlatformActionResult, iPlatformValue<T>, iPlatformSubscription

electron/
├── main.ts, main/      окно, протокол blind://, регистрация plugins
├── preload.ts          contextBridge.exposeInMainWorld(ELECTRON_CONFIG.bridgeKey, …)
├── preload/bridge.ts   сборка bridge из preload-частей plugins
├── plugin/<name>/      channel.ts, main.ts, preload.ts, type.ts
└── config.ts           bridgeKey, ipcPrefix, протокол, каталоги данных
```

## Эталон: Tool `power`

Самый маленький полный пример — используй как образец.

```
src/core/platform/tool/power/
├── index.ts              resolveRuntimeAdapter → createPowerTool(adapter) → export { keepAwake, allowSleep }
├── tool.ts               createPowerTool: общий API поверх adapter
├── type.ts               iPowerAdapter
├── adapters/
│   ├── web.adapter.ts      Wake Lock через helper
│   ├── mobile.adapter.ts   @capawesome/capacitor-keep-awake, ошибки → isHandled: false
│   └── desktop.adapter.ts  HelperBridge.getCapability('power')
└── helpers/web.helper.ts
```

И парный Electron plugin `electron/plugin/power/` (см. `electron.md`).

Другие Tools устроены так же; более сложные (`audio`) добавляют `engines/`. Tools, у которых одна реализация для всех сред, используют `browser.adapter.ts` (`input`, часть `system`).

## Рецепт: новая возможность

1. **Контракт** — `tool/<name>/type.ts`: интерфейс adapter. Возвраты через общие типы:
   - действие → `Promise<iPlatformActionResult>` (`isHandled`);
   - значение → `Promise<iPlatformValue<T>>`;
   - подписка → `iPlatformSubscription` с `unsubscribe`.
2. **Общая семантика** — `tool.ts`: состояние, orchestration, общая логика, которую нельзя дублировать в adapters.
3. **Adapters** — `adapters/web|mobile|desktop.adapter.ts`. Каждый — только platform-specific часть.
   - mobile: вызов Capacitor plugin, `try/catch`, отказ/отмена/отсутствие → `isHandled: false`;
   - desktop: `HelperBridge.getCapability('<name>')` → Electron plugin;
   - web: браузерный API или честное «не поддерживается».
4. **Точка входа** — `index.ts`: `resolveRuntimeAdapter({ web, mobile, desktop })`, экспорт публичного API и нужных типов.
5. **Desktop** — если нужен main process: Electron plugin (`electron.md`), регистрация в `electron/main/plugins.ts` и `electron/preload/bridge.ts`, тип в bridge-типах runtime.
6. **Использование в app** — только через `@/core/platform/tool/<name>`.
7. **Документация** — если появился новый Tool или изменился публичный API, предложи обновить `docs/` (с разрешения).

## Частые ошибки

- Платформенная проверка `if (isMobile())` в компоненте вместо adapter.
- Импорт Capacitor plugin во Vue-компоненте или composable (готовые Capacitor-skills часто советуют «обернуть в composable» — в Blind это делается в Tool).
- Логика инструмента в `runtime` «потому что нужна нескольким adapters» — она должна быть в `tool.ts` или `helpers` этого Tool.
- Исключение вместо `isHandled: false` для штатного «не поддерживается».
- Electron plugin, повторяющий весь API Tool, хотя main process нужен для одной операции.
