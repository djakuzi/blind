---
name: game-design
description: >
  ЗАГОТОВКА, ещё не готов. Геймдизайн Blind: механики, core loop, режимы
  (single-hit, health, survival), правила раундов и победы, баланс, прогрессия,
  читаемость игровой ситуации, стресс-тест концепций. Use when designing or
  evaluating game mechanics, modes, rules or balance in Blind.
---

# Game Design для Blind — ЗАГОТОВКА

> **Статус: не готов.** Skill ещё не собран. Это заготовка со списком того, что в нём должно быть, и источников, которые нужно разобрать.

## Что делать агенту сейчас

Если задача касается механик, правил, режимов или баланса:

1. **Не выдумывай механики** и не выдавай свои идеи за решения проекта. Механики Blind ещё не определены.
2. Сообщи пользователю, что skill `game-design` ещё не собран, и предложи **сначала собрать его**: разобрать источники ниже вместе с идеями пользователя, так же, как собирались остальные skills в `.ai-core/client/skills`.
3. Если пользователь просит просто обсудить идеи — можно, но явно помечай всё как Experimental / Proposed (статусы как в `ui-ux-design`) и ничего не реализуй в коде без прямой просьбы.

## Что уже есть в проекте

- `src/game/types/gameMode.types.ts` — режимы `single-hit`, `health` (играбельные) и `survival`; игроки, размер команды, раунды, условие победы.
- В README: кроссплатформенная PvP-аркада. Подробного описания механик и документа геймдизайна пока нет.

## Что должно быть в готовом skill

- **Порядок проектирования:** действия игрока → core loop → проигрыш и восстановление → прогрессия → длина матча.
- **Работа с вариантами:** несколько существенно разных концепций механики, проверка каждой на простых стратегиях («стоять в углу и стрелять», «только убегать»).
- **Главная особенность Blind:** если игрок видит только своё поле — игра строится вокруг информации о противнике: что известно, как догадаться, какие подсказки есть. Skill должен держать это в центре (подтвердить с пользователем).
- **Режимы:** чем отличаются `single-hit`, `health`, `survival`, как добавлять новые.
- **Баланс:** длительность матча, шанс отыграться, отсутствие доминирующей стратегии, честность для обеих сторон.
- **Читаемость:** игрок понимает, что происходит, почему проиграл и что мог сделать иначе.
- **Стресс-тест концепции:** поиск дыр в правилах до кода; разделение дефектов и открытых вопросов.
- **Фиксация решений:** куда записываются утверждённые механики (документ геймдизайна в `docs/`, с разрешения пользователя).

## Что нужно решить пользователю до сборки

- Базовая механика матча и что именно «не видит» игрок.
- Различия режимов и условия победы.
- Где хранить документ геймдизайна.

## Источники для разбора

| Источник | Что смотреть |
|---|---|
| [openai/plugins · game-studio](https://github.com/openai/plugins/tree/main/plugins/game-studio/skills/game-studio) | порядок: фантазия и действия игрока → core loop → провал → прогрессия → длина сессии (лицензия не указана — только идеи) |
| [abagames · exploring-game-design-space](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/exploring-game-design-space) | разные механики как проверяемые гипотезы (MIT) |
| [abagames · designing-minimal-game-rules](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/designing-minimal-game-rules) | минимальные правила, проверка простыми стратегиями |
| [abagames · stress-testing-game-concepts](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/stress-testing-game-concepts) | поиск дыр в концепции |
| [abagames · evaluating-gameplay-balance](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/evaluating-gameplay-balance) | баланс через телеметрию и ботов |
| [abagames · gating-intent-legibility](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/gating-intent-legibility) | понятны ли цель, выбор и риски |
| [abagames · curating-game-concept-portfolio](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/curating-game-concept-portfolio) | выбор из нескольких концепций |
| [abagames · directing-game-visuals](https://github.com/abagames/agentic-gamedev-skills/tree/main/.agents/skills/directing-game-visuals) | визуальная иерархия игровых событий |
| [gamedev-skills · game-docs](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/main/skills/workflows/game-docs) | одностраничный документ геймдизайна, синхронный с кодом (Apache-2.0) |
| [gamedev-skills · prototype-fast](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/main/skills/workflows/prototype-fast) | быстрые прототипы с решением «оставить/выбросить» |

Также сверить с собранными skills: `ui-ux-design` (игровой UI), `ui-animation` (game feel), `visual-asset-design` (читаемость игровых объектов).
