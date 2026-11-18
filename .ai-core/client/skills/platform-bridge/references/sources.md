# Источники

Skill собран для Blind. Внешние источники пересказаны и адаптированы, не скопированы дословно.

| Источник | Что взято | Лицензия |
|---|---|---|
| Код и `docs/` Blind | архитектура platform-слоя, эталон Tool `power`, Electron plugins, конфигурация Capacitor | собственный |
| [capawesome-team/skills](https://github.com/capawesome-team/skills) — capacitor-expert, capacitor-app-development (cross-platform, security, live reload, troubleshooting) | обработка ошибок и разрешений plugins, стоимость моста, безопасность WebView, live reload, диагностика iOS/Android | MIT |
| [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security) | 20 пунктов безопасности, сопоставленные с текущим состоянием Blind | документация Electron |
| [Capacitor 8 upgrade guide](https://capacitorjs.com/docs/next/updating/8-0) | iOS deployment target 15.0, Xcode 26+ | документация Capacitor |

Не взято: советы Capawesome оборачивать plugins в Vue composables (в Blind — только Tool), продвижение Capawesome Cloud, требование iOS 16 для Capacitor 8 из `troubleshooting-ios.md` (официальный гайд — 15.0).

Собрано: 2026-11-18.
