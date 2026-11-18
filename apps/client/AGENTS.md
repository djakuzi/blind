# AGENTS — client

Правила клиента: Vue + Capacitor (iOS, Android) + Electron. Общие правила — [корневой AGENTS.md](../../AGENTS.md).

## Пути

1. Пути к коду (`src/…`, `electron/…`, `scripts/…`) — от `apps/client`. Здесь же выполняются команды `npm run …`.
2. Пути к документации (`docs/…`) — от корня репозитория.

## Слои

app, core, game, generators, plugins, setup, styles, stores.

## Где брать информацию

| Задача | Документ |
|---|---|
| слои `src/app`, views, layouts, features, stores, providers, overlays, shared components | `docs/client/architecture/sections/app-flow.md` |
| запуск приложения, setup, готовность, loader | `docs/client/architecture/sections/app-lifecycle.md` |
| `src/core`, platform runtime/tool, `media`, SDK-обёртки | `docs/client/architecture/sections/core-flow.md` |
| игровая логика, состояние, рендер | `docs/client/architecture/sections/game-flow.md` |
| именование, общий code style | `docs/client/code/rules/codeStyle.md` |
| props Vue-компонентов | `docs/client/code/rules/componentProps.md` |
| CSS, tokens, contracts, safe area, responsive | `docs/client/code/rules/cssStyle.md` |
| форматирование | `docs/client/code/rules/codeFormatting.md` |
| масштаб UI, единицы размеров | `docs/client/interface/sections/ui-scale.md` |
| тексты UI, переводы, языки, aria-тексты, `Intl` | `docs/client/interface/sections/localization.md` |
| звук из UI, `useAudio`, prop `sound` | `docs/client/interface/index.md` и `docs/client/audio` |
| generated-файлы, генераторы, audio и icons ассеты | `docs/client/generators` — до изменения generated-файлов |
| Capacitor plugin | `docs/client/plugins/rules/capacitorPluginRule.md` |
| Electron plugin, preload, IPC, bridge | `docs/client/plugins/rules/electronPluginRule.md` и core-flow |
| конкретный plugin | `docs/client/plugins` — раздел «Разделы» |
| запуск, платформы, CLI | `docs/client/projectSetup/index.md`, `docs/client/cli` |
| env, нативные настройки | `docs/client/settingsProject` |

## Правила клиента

1. `src/core/platform/runtime` не зависит от `src/core/platform/tool`. Реализация инструмента — в его Tool, runtime — только инфраструктура среды.

## Skills

Плагин `blind-client`, skills — в `.ai-core/client/skills`.

| Задача | Skill |
|---|---|
| экраны, меню, HUD, модалки, взаимодействия | `ui-ux-design` |
| SVG, иконки, курсоры, игровая графика | `visual-asset-design` |
| аудит и доводка готового интерфейса | `visual-review` |
| анимации и переходы | `ui-animation` |
| Web, Capacitor, Electron, platform Tools | `platform-bridge` |
| механики и архитектура игры | `game-design`, `game-architecture` (заготовки) |
