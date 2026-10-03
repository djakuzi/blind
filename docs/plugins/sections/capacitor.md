# Capacitor plugins

Capacitor plugins используются для native-возможностей мобильных приложений.

Основные правила:

- прямой вызов Capacitor plugin должен находиться внутри соответствующего `core/platform/tool`, если для возможности существует Tool;
- platform-specific работа размещается в mobile adapter соответствующего Tool;
- общая семантика инструмента остается в `tool.ts`;
- app и game слои не должны напрямую зависеть от Capacitor SDK, если интеграция уже закрыта Tool;
- после изменений native dependencies или plugin configuration нужно синхронизировать соответствующую Capacitor-платформу.

Capacitor plugin является способом реализации mobile adapter, а не отдельным архитектурным слоем приложения.
