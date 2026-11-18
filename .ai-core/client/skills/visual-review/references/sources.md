# Источники

Skill собран для Blind. Внешние источники пересказаны и адаптированы, не скопированы дословно.

| Источник | Что взято | Лицензия |
|---|---|---|
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — critique, critique-rubric, audit, polish | две независимые оценки (дизайн до техники), вердикт специфичности, эвристики Нильсена 0–4 с `n/a`, когнитивная нагрузка, персоны, P0–P3, порядок доводки, классификация расхождений | Apache-2.0 |
| [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) | технические проверки: доступность, фокус, анимация, контент, touch, анти-паттерны | MIT |
| [openai/plugins · game-studio/game-playtest](https://github.com/openai/plugins/tree/main/plugins/game-studio/skills/game-playtest) | съёмка состояний, отдельная проверка UI-слоя, находки по важности с шагами | лицензия не указана — только идеи, без текста |
| ChatGPT-плагин Blind Development | статусы решений (Implemented ≠ Approved) | собственный |

Не взято: CLI-детектор, overlay, сохранение отчётов и hooks Impeccable — они требуют установки и запуска стороннего кода. Правила Vercel, противоречащие проекту (прямой `env()` для safe area, состояние в URL, Title Case, hydration), отброшены или заменены правилами Blind.

Собрано: 2026-11-18.
