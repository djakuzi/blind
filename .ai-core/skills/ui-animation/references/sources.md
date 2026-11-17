# Источники

Skill собран для Blind. Внешние источники пересказаны и адаптированы, не скопированы дословно.

| Источник | Что взято | Лицензия |
|---|---|---|
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — animate | задача движения, motion-план, выбор средства по смыслу, тайминг, hover-правила, reduced motion как альтернатива, критерии готовности | Apache-2.0 |
| [gamedev-skills · game-feel](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/tree/main/skills/disciplines/game-feel) | уровни отклика, squash & stretch, тряска от травмы, hit-stop, частые ошибки, доступность | Apache-2.0 |
| [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) | compositor-friendly свойства, без `transition: all`, `transform-origin`, SVG `transform-box`, прерываемость | MIT |
| [openai/plugins · game-studio/game-ui-frontend](https://github.com/openai/plugins/tree/main/plugins/game-studio/skills/game-ui-frontend) | сильное движение только для смены состояния, награды, опасности | лицензия не указана — только идеи |
| ChatGPT-плагин Blind Development | motion как иерархия и обратная связь, текущие анимации не утверждены | собственный |
| Код проекта Blind | компоненты effects/transition, tokens motion, hover через media query | собственный |

Не взято: `motion-capture` и motion-reviewer Impeccable (требуют их CLI). Вместо них — собственный `tools/motion-probe.js`.

Собрано: 2026-11-18.
