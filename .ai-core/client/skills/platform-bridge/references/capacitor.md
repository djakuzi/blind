# Capacitor в Blind

Правила — `docs/client/plugins/rules/capacitorPluginRule.md`. Запуск — `docs/client/projectSetup/sections/android.md`, `ios.md`.

## Текущее состояние

- Capacitor 8.x. Plugins: `device`, `filesystem`, `haptics`, `preferences`, `screen-orientation`, `status-bar`, `text-zoom`, `@capawesome/capacitor-keep-awake`, `@capgo/capacitor-native-audio`.
- Все вызовы plugins — только в `src/core/platform/tool/*/adapters/mobile.adapter.ts` и `runtime/mobile/helpers`. Так и держать.
- `capacitor.config.ts`: `appId: com.blind.game`, `webDir: dist`, `StatusBar.overlaysWebView: true` (контент под статус-баром → safe area обязательна), iOS `preferredContentMode: 'mobile'`.
- iOS: deployment target 15.0, зависимости через Swift Package Manager (`ios/App/CapApp-SPM`).
- Android: `minSdkVersion 26`, `compileSdk/targetSdk 36` (`android/variables.gradle`).

## Использование plugin

- Вызов — в mobile adapter, обёрнут в `try/catch`. Отказ, отмена пользователем, недоступность → `isHandled: false` или осмысленное значение, а не необработанное исключение.
- Разрешения: сначала проверить, потом запросить, отдельно обработать окончательный отказ. На iOS после отказа повторно запросить нельзя — только через настройки устройства.
- Мост JS ↔ native дорогой: не делай много мелких вызовов в цикле, не передавай большие данные base64 — пути к файлам, пакетные операции.
- Не используй `Capacitor.getPlatform()` в app-коде — среда определяется `PlatformRuntime` в `core/platform/runtime`.

## Новый plugin

1. Согласуй с пользователем (см. SKILL.md, «Новые зависимости»): поддержка Capacitor 8, iOS через SPM, лицензия, поддержка.
2. `npm install <plugin>` → `npx cap sync` (обе платформы или нужную).
3. Native-настройки (Info.plist usage descriptions, AndroidManifest permissions) — если plugin требует. Без них приложение может упасть при первом обращении.
4. Обёртка — только в mobile adapter соответствующего Tool.
5. Web и desktop поведение — явно реализовать или вернуть «не поддерживается».

## После изменений

- Изменился web-код → `npm run build` (или `build:debug`) → `npx cap sync <platform>` → запуск из Xcode/Android Studio.
- Изменились native dependencies или `capacitor.config.ts` → обязательно `npx cap sync`.
- Live reload на устройстве: `npx cap run <platform> --live-reload` (устройство и компьютер в одной сети). `server.cleartext` / `server.url` — только для разработки, не коммитить в production-конфиг.

## Безопасность

- Никаких секретов и ключей с правами записи в клиентском коде — он извлекается из сборки.
- Токены и чувствительные данные — не в `localStorage`, IndexedDB или Preferences (не шифруются); для таких данных нужно secure storage (Keychain / Keystore) — согласовать plugin.
- Только HTTPS для сетевых запросов.
- Отладка WebView — выключена в production-сборке.
- Deep links (если появятся): Universal Links / App Links, без чувствительных данных в параметрах.

## Диагностика (частое)

- **iOS:** проблемы SPM — Xcode → File → Packages → Reset Package Caches / Resolve; затем `npx cap sync ios`. Подпись — Signing & Capabilities, команда разработчика, Bundle ID.
- **Android:** Gradle sync — проверь JDK в Android Studio (Gradle JDK), версии в `variables.gradle`, AGP в `android/build.gradle`; Invalidate Caches.
- **Белый экран:** не выполнен `build` перед `cap sync`; ошибка JS при старте — смотри Safari Web Inspector (iOS) или `chrome://inspect` (Android).
- **Plugin «not implemented»:** не выполнен `cap sync` после установки или plugin не поддерживает платформу.

## Окружение

Требования к окружению — `docs/client/projectSetup/index.md`: Android собирается с Java 21 (`JavaVersion.VERSION_21` в `android/app/capacitor.build.gradle`), iOS использует SPM и открывается через `ios/App/App.xcodeproj`. Перед советом по версиям инструментов сверь с этими файлами; если они расходятся с документацией — сообщи пользователю, не исправляй `docs/` молча.
