# Правила Capacitor plugins

Capacitor plugins используются для native-возможностей мобильных приложений.

Основные правила:

1. Прямой вызов Capacitor plugin должен находиться внутри соответствующего `core/platform/tool`, если для возможности существует Tool.
2. Platform-specific работа размещается в mobile adapter соответствующего Tool.
3. Общая семантика инструмента остается в `tool.ts`.
4. App и game слои не должны напрямую зависеть от Capacitor SDK, если интеграция уже закрыта Tool.
5. Общую логику не нужно дублировать между mobile implementation и другими platform implementations, если ее можно безопасно переиспользовать внутри Tool.
6. После изменений native dependencies или plugin configuration нужно синхронизировать соответствующую Capacitor-платформу.

Capacitor plugin является способом реализации mobile adapter, а не отдельным архитектурным слоем приложения.
