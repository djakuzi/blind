# Правила platform plugins

Перед изменением plugin нужно определить, к какому типу интеграции он относится:

- [Capacitor plugins](../../plugins/sections/capacitor.md);
- [Electron plugins](../../plugins/sections/electron.md).

Общие правила:

1. Platform plugin не должен протекать напрямую в app или game слой, если интеграция закрывается `core/platform/tool`.
2. Общая семантика инструмента должна оставаться в Tool.
3. Platform-specific реализация должна находиться максимально близко к соответствующему adapter или plugin.
4. Общую логику не нужно дублировать между platform implementations, если она может безопасно переиспользоваться внутри Tool.
5. Electron IPC boundary должен оставаться узким и проверять входные данные в main process.
6. При изменении публичного plugin contract нужно синхронно обновлять его типы, bridge и связанную документацию.
