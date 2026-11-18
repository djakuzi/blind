# Реализация в Blind

## Что уже есть (проверь перед созданием нового)

| Где | Что |
|---|---|
| `src/app/shared/components/effects/transition/` | `AppFadeTransition`, `AppRevealTransition`, `AppScaleTransition`, `AppSwapTransition` (смена контента по `transitionKey`, `out-in`) |
| `src/app/shared/components/effects/interaction/AppInteractionScale.vue` | отклик hover/press масштабом |
| `src/app/shared/components/effects/attention/AppPulseAttention.vue` | привлечение внимания |
| `src/app/shared/components/effects/fill/` | `AppBloodFill`, `AppFillAware` — заливка/прогресс |
| `src/app/layouts/components/transition/` | `AppTransitionScreen` (переход между route), `AppTransitionHeader` |
| `src/app/shared/components/interaction/overlay/AppModal.vue` | появление модалки |
| `src/app/shared/components/ui/loader/AppLineLoader.vue` | загрузчик |
| `src/app/shared/styles/utilities/interactive.css` | базовые transitions интерактивных элементов, focus, reduced motion |
| `src/app/shared/styles/tokens/motion.css` | длительности и easing |

Если нужный эффект близок к существующему — расширь существующий компонент или используй его, не плоди параллельный.

## Выбор техники

- **CSS transition** — смена состояния (hover, selected, disabled, открыто/закрыто).
- **CSS keyframes** — ограниченные последовательности и циклы (загрузчик, пульс).
- **Vue `<Transition>`** — появление и исчезновение элементов, смена контента и экранов. Классы `*-enter-from`, `*-enter-active`, `*-leave-to` и т.д. Длительность Vue берёт из computed style.
- **Vue `<TransitionGroup>`** — списки с перемещением (FLIP через `*-move`).
- **Web Animations API** (`element.animate`) — когда нужны динамические значения, последовательность, прерывание из JS.
- **View Transitions API** — только если непрерывность между состояниями — главная идея и есть fallback; поддержка в мобильных WebView может отличаться — проверь.

## Свойства

- Основа — `transform` и `opacity`.
- Размер блока: не анимируй `height` напрямую. Варианты: `grid-template-rows: 0fr → 1fr`, FLIP, `transform: scale` с компенсацией, `clip-path`.
- Позиция: `transform: translate`, не `top`/`left`.
- Смещения — в `rem`, чтобы движение масштабировалось вместе с UI (`ui-scale.md`).
- `filter`, `backdrop-filter`, большие тени — ограничивай областью и частотой; в мобильном WebView они дорогие.
- `will-change` — только на время анимации (например, в `*-active` классах), не постоянно на покое.
- SVG: трансформации на `<g>` с `transform-box: fill-box; transform-origin: center`.
- Правильный `transform-origin` — от точки, откуда «растёт» элемент (кнопка, из которой открылось меню).

## Прерывание и повтор

- Transition на CSS сам продолжает с текущего значения — предпочитай его keyframes, если действие можно прервать.
- Повторный запуск того же эффекта: отменяй предыдущий (`animation.cancel()` / сброс класса), иначе два эффекта борются и элемент остаётся не в исходном состоянии.
- Каждый эффект в конце возвращается точно в состояние покоя.
- Ввод не блокируется анимацией; если блокировка нужна (защита от двойного нажатия) — она короткая и явная.

## Пауза и видимость

- Бесконечные декоративные анимации останавливаются вне экрана и в скрытой вкладке (`animation-play-state`, IntersectionObserver, `visibilitychange`).
- Меню паузы не должно замирать вместе с игрой (когда появится игровой цикл).

## Tokens

- Повторяемые длительности и easing — из `tokens/motion.css`.
- Технические значения одной конкретной анимации допустимо оставить локальными (`cssStyle.md`, «Когда нужен новый token»).
- Если значение начинает повторяться — предложи token, не добавляй молча.
