---
name: platform-bridge
description: >
  Кроссплатформенная часть Blind: Web + Capacitor (iOS, Android) + Electron (desktop).
  Platform Tools и adapters в src/core/platform, runtime, Capacitor plugins,
  Electron plugins (main/preload/IPC/contextBridge), различия WebView/браузера/Electron,
  безопасность, сборка, cap sync, диагностика native-проблем. Use for native features,
  platform adapters, Capacitor, Electron, IPC and cross-platform bugs in Blind.
---

# Platform Bridge для Blind

Работай как разработчик, который держит в голове три среды сразу: браузер, мобильный WebView (Capacitor) и Electron. Любая платформенная возможность проходит через `src/core/platform` — UI и игра о native SDK не знают.

## Источник правил (читать перед изменениями)

- `docs/architecture/sections/core-flow.md` — `adapter`, `runtime`, `tool`, границы зависимостей.
- `docs/plugins/rules/capacitorPluginRule.md` — Capacitor plugins.
- `docs/plugins/rules/electronPluginRule.md` — Electron plugins.
- `docs/projectSetup/` — запуск и сборка Web, Android, iOS, Desktop.
- `docs/plugins/` — описания конкретных plugins (если есть).

Этот skill объясняет, **как** применять эти правила; при расхождении правила в `docs/` важнее, а расхождение надо назвать пользователю.

## Главные инварианты

1. Прикладной код (`src/app`, будущий `src/game`) не импортирует `@capacitor/*`, `@capgo/*`, `@capawesome/*`, `electron` и не трогает `window.<bridgeKey>` — только публичный API Tool из `src/core/platform/tool/<name>`.
2. `runtime` не импортирует `tool`. `tool → runtime` — можно.
3. Реализация инструмента — внутри его Tool (adapters, helpers, engines), не в `runtime`.
4. Electron plugin — только то, что требует main process / privileged API. Он не дублирует Tool целиком.
5. `ipcRenderer` — только в `electron/plugin/*/preload.ts`. В renderer — только через `contextBridge` и `HelperBridge`.
6. Входные данные IPC проверяются в main process.
7. Новый native dependency или изменение `capacitor.config.ts` → `npx cap sync`.
8. Публичный platform API или граница изменились → обновить документацию (с разрешения пользователя, см. `AGENTS.md`).

## Порядок работы

1. **Определи возможность и среды.** Что нужно (звук, хранилище, вибрация, экран…), на каких runtime (`web`, `mobile`, `desktop`) и какое поведение в каждом, включая «не поддерживается».
2. **Найди существующий Tool.** Сейчас есть: `audio`, `filesystem`, `input`, `power`, `storage`, `system`, `vibration`, `view`. Расширяй его, если возможность к нему относится.
3. **Спроектируй контракт** в `type.ts`: результат через общие типы `iPlatformActionResult`, `iPlatformValue<T>`, `iPlatformSubscription` (`src/core/platform/type.ts`). «Не поддерживается» — это нормальный результат (`isHandled: false`), а не исключение.
4. **Реализуй adapters** по рецепту `references/architecture.md`; для desktop — Electron plugin по `references/electron.md`; для mobile — Capacitor plugin по `references/capacitor.md`.
5. **Учти различия сред** — `references/platform-differences.md`.
6. **Проверь** по `references/verify.md`: lint, типы, сборки нужных платформ, `cap sync`. Запуск в браузере или Electron — по правилу «Визуальная проверка» из `AGENTS.md` (сначала спроси пользователя). Честно назови, что требует реального устройства.

## Новые зависимости

Не добавляй npm-пакет или Capacitor/Electron plugin без согласования с пользователем: он меняет native-проекты, размер сборки и требования к окружению. Перед предложением проверь: поддерживается ли нужная версия Capacitor (сейчас 8.x), есть ли web/desktop-аналог, лицензия, активность поддержки.

## Безопасность

- Electron: чеклист — `references/electron.md` («Безопасность»).
- Capacitor/WebView: секреты не в клиентском коде, чувствительные данные не в `localStorage`/Preferences, только HTTPS, `server.cleartext` только для разработки — `references/capacitor.md`.

## Связь с другими skills

- `ui-ux-design`, `ui-animation` — когда платформенное отличие влияет на интерфейс (safe area, hover, haptic, fullscreen).

## Общение

По-русски. Для каждого решения называй, какие runtime затронуты и как ведёт себя каждый. Разделяй проверенное (lint, сборка, браузер, Electron) и непроверенное (реальный iPhone/Android). Не предлагай большой рефакторинг platform-слоя без технической причины.
