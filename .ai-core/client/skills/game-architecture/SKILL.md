---
name: game-architecture
description: >
  ЗАГОТОВКА, ещё не готов. Архитектура игровой части Blind: src/game, src/engine,
  игровой цикл, состояние матча, рендер игрового поля, ввод, сетевой PvP (Online,
  LAN, Bluetooth), режимы и раунды. Use when a task touches game loop, game state,
  engine, rendering of the playfield or multiplayer netcode in Blind.
---

# Game Architecture для Blind — ЗАГОТОВКА

> **Статус: не готов.** Skill ещё не собран. Это заготовка со списком того, что в нём должно быть, и источников, которые нужно разобрать.

## Что делать агенту сейчас

Если задача касается игровой логики, `src/game`, `src/engine`, рендера игрового поля или сетевой игры:

1. **Не принимай архитектурных решений самостоятельно**: не выбирай движок или библиотеку рендера, сетевую модель, структуру игрового цикла и не пиши их «по умолчанию».
2. Сообщи пользователю, что skill `game-architecture` ещё не собран, и предложи **сначала собрать его**: разобрать источники ниже вместе с решениями пользователя, так же, как собирались остальные skills в `.ai-core/client/skills`.
3. Если пользователь просит продолжить без skill — работай только в рамках его прямых указаний, опираясь на `AGENTS.md` и `docs/client/architecture/sections/game-flow.md`.

## Что уже есть в проекте

- `docs/client/architecture/sections/game-flow.md` — пока только заголовок.
- `src/game/types/gameMode.types.ts` — режимы `single-hit`, `health`, `survival`; игроки, размер команды, раунды, условие победы.
- `src/engine/index.ts`, `src/game/index.ts` — пустые.
- Типы подключения в UI: Online, LAN, Bluetooth.
- Рендер игрового поля **не выбран** (в `docs/client/interface/sections/ui-scale.md` Three.js упомянут только как возможный вариант).

## Что должно быть в готовом skill

- **Игровой цикл:** фиксированный шаг логики отдельно от частоты отрисовки, интерполяция.
- **Логика отдельно от рендера:** состояние матча — данные; рендер только рисует и не является источником правды.
- **Связь с Vue:** события игры → HUD и меню; пауза и модалки блокируют игровой ввод.
- **Ввод:** именованные действия вместо клавиш, единая схема для клавиатуры, touch и геймпада.
- **Сеть PvP:** выбор модели (авторитетный сервер / lockstep / rollback) под Online, LAN, Bluetooth; детерминизм, если нужен.
- **Режимы и раунды:** как описываются режимы и условия победы, чтобы новый режим добавлялся без переписывания.
- **Производительность:** бюджет кадра, мобильные WebView, профилирование.
- **Проверка:** тесты логики без рендера, прогон матчей ботами, инварианты, smoke-тест в браузере.
- **Связь с платформой:** звук, вибрация, keep-awake, ориентация — через `core/platform` (`platform-bridge`).

## Что нужно решить пользователю до сборки

- Технология рендера игрового поля.
- Сетевая модель и транспорт для Online / LAN / Bluetooth.
- Нужен ли детерминизм симуляции.
- Где граница `src/engine` и `src/game`.

Решения фиксируются в `docs/client/architecture/sections/game-flow.md` (с разрешения пользователя), skill потом опирается на них.

## Источники для разбора

| Источник | Что смотреть |
|---|---|
| [openai/plugins · game-studio/web-game-foundations](https://github.com/openai/plugins/tree/main/plugins/game-studio/skills/web-game-foundations) | логика отдельно от рендера, именованный ввод, DOM-HUD поверх canvas (лицензия не указана — только идеи) |
| [openai/plugins · game-studio/game-playtest](https://github.com/openai/plugins/tree/main/plugins/game-studio/skills/game-playtest) | проверка игры в браузере |
| [openai/plugins · game-studio/references](https://github.com/openai/plugins/tree/main/plugins/game-studio/references) | `engine-selection.md`, `phaser-architecture.md`, `three-webgl-architecture.md`, `webgl-debugging-and-performance.md` — для выбора рендера |
| `openai/skills` · `develop-web-game` | цикл разработки с Playwright, хуки `render_game_to_text` и `advanceTime` для детерминированной проверки (точный путь в репозитории уточнить) |
| [gamedev-skills · physics-tuning](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/main/skills/disciplines/physics-tuning) | фиксированный шаг, интерполяция (Apache-2.0) |
| [gamedev-skills · input-systems](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/main/skills/disciplines/input-systems) | именованные действия, буферизация, переназначение |
| [gamedev-skills · performance-optimization](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/main/skills/disciplines/performance-optimization) | профилирование, бюджет кадра |
| [gamedev-skills · save-systems](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/main/skills/disciplines/save-systems) | сериализация состояния, если понадобится |
| [gamedev-skills · web-engines](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/main/skills/web-engines) | Phaser, PixiJS, three.js — для сравнения вариантов рендера |
| [abagames · implementing-gameplay-invariants](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/implementing-gameplay-invariants) | инварианты игры и их проверка (MIT) |
| [abagames · smoke-testing-web-games](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/smoke-testing-web-games), [probing-web-game-mechanics](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/probing-web-game-mechanics), [localizing-game-state-divergence](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/localizing-game-state-divergence) | проверка и отладка игровой логики |
| [Gaffer On Games — Fix Your Timestep!](https://gafferongames.com/post/fix_your_timestep/) | классика про фиксированный шаг |
| [Heroic Labs — Netcode in games](https://heroiclabs.com/blog/netcode-in-games/) | prediction, rollback, авторитетный сервер |
| [NetplayJS](https://github.com/rameshvarun/netplayjs) | пример rollback + WebRTC для браузерных игр |

Также сверить с собранными skills: `ui-ux-design` (HUD, защита игрового поля), `ui-animation` (game feel), `platform-bridge` (платформенные возможности).
