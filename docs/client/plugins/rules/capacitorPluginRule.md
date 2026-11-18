# Правила Capacitor plugins

Как использовать Capacitor plugins для native-возможностей iOS и Android.

## Правила

1. Plugin вызывается только в mobile adapter соответствующего Tool в `src/core/platform/tool/`.
2. Общая семантика инструмента — в `tool.ts` этого Tool, а не в adapter.
3. App- и game-код не импортирует Capacitor SDK, если возможность закрыта Tool.
4. Общая логика не дублируется между mobile и другими adapters.
5. После изменения native-зависимостей или настроек plugin — `npx cap sync`.

Capacitor plugin — способ реализовать mobile adapter, а не отдельный слой приложения.

## Связанные разделы

- [Архитектура core-слоя](../../architecture/sections/core-flow.md) — как устроены Tool и adapters, внутри которых используется plugin.
