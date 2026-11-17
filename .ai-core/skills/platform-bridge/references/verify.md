# Проверка платформенных изменений

## Всегда

```bash
npm run lint
```

```bash
npm run build
```

`build` включает `vue-tsc -b` — проверка типов, в том числе контрактов Tool и bridge.

Плюс быстрые проверки границ:

```bash
# Capacitor/Electron SDK вне platform-слоя (должно быть пусто)
grep -rlnE "@capacitor/|@capgo/|@capawesome/|from 'electron'" src | grep -v "^src/core/platform/"

# ipcRenderer в renderer-коде (должно быть пусто)
grep -rn "ipcRenderer" src

# runtime не импортирует tool (должно быть пусто)
grep -rn "/tool" src/core/platform/runtime
```

## Desktop

```bash
npm run desktop:build
```

Запуск для ручной проверки — `npm run desktop:dev`, с согласия пользователя (правило «Визуальная проверка» в `AGENTS.md`): функция в окне, полноэкранный и оконный режим, повторный вызов, отказ.

## Mobile

```bash
npm run build
```

```bash
npx cap sync
```

`cap sync` обязателен после изменения native dependencies или `capacitor.config.ts`. Запуск на симуляторе/устройстве — Xcode / Android Studio (`npx cap open ios|android`) или `npx cap run`. Обычно это делает пользователь — опиши шаги и что проверить.

## Web

С согласия пользователя (правило «Визуальная проверка» в `AGENTS.md`) — dev-сервер (`web-dev` в `.claude/launch.json` или `npm run dev`): функция работает или корректно сообщает «не поддерживается»; консоль без ошибок.

## Отчёт

Перечисли по средам:

| Среда | Проверено как |
|---|---|
| Web | браузер / не проверено |
| Desktop | `desktop:build` / запуск Electron / не проверено |
| iOS | сборка / симулятор / устройство / не проверено |
| Android | сборка / эмулятор / устройство / не проверено |

Не пиши «работает на iOS», если проверялась только сборка web-части.
