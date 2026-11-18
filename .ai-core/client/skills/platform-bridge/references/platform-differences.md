# Различия сред

Одна и та же web-функция ведёт себя по-разному в браузере, мобильном WebView (iOS WKWebView, Android WebView) и Electron (Chromium). Перед решением проверь, как она работает в каждой из трёх.

| Тема | Браузер | Capacitor iOS / Android | Electron |
|---|---|---|---|
| **Звук** | autoplay заблокирован до жеста пользователя | WebView ограничивает autoplay; в проекте mobile-звук через `@capgo/capacitor-native-audio` | Chromium; desktop-звук через Electron plugin `audio` |
| **Вибрация / haptic** | `navigator.vibrate` нет в Safari/iOS; на Android-браузере есть | `@capacitor/haptics` | нет вибрации устройства; Tool `vibration` решает (например, rumble геймпада) |
| **Не засыпать** | Screen Wake Lock API (не везде) | `keep-awake` plugin | `powerSaveBlocker` через plugin `power` |
| **Fullscreen** | Fullscreen API; на iPhone Safari для элементов не работает | приложение уже на весь экран | окно `BrowserWindow`, plugin `view` |
| **Ориентация** | lock обычно только в fullscreen | `@capacitor/screen-orientation` | не применяется |
| **Safe area** | `env(safe-area-inset-*)` при `viewport-fit=cover` (есть в `index.html`) | статус-бар поверх WebView (`overlaysWebView: true`) — safe area обязательна | обычно нули |
| **Хранилище** | `localStorage`/IndexedDB, может очищаться | Preferences / Filesystem; WebView-хранилище iOS может очищаться системой | файлы в `userData` через plugins `storage`, `filesystem` |
| **Hover** | есть на desktop, нет на touch | нет | есть |
| **Курсоры** | кастомные SVG-курсоры | не видны | есть |
| **Масштаб текста** | системный zoom браузера | системный размер шрифта влияет на WebView; в проекте есть `@capacitor/text-zoom` | zoom окна |
| **Клавиатура экрана** | перекрывает часть viewport | перекрывает; может менять высоту viewport | физическая |
| **Кнопка «назад» (Android)** | — | системная кнопка/жест; `@capacitor/app` в проекте не установлен — поведение по умолчанию | — |
| **Сеть** | CORS браузера | origin WebView (`capacitor://localhost` / `https://localhost`) — учитывай в CORS сервера | origin `blind://app` в production |

## Правила

- Не предполагай, что эффект одинаково работает везде: `backdrop-filter`, большие blur и тени, SVG-фильтры заметно дороже в мобильных WebView.
- Поведение «не поддерживается» — явное, через результат Tool, а не молчаливая ошибка.
- Проверяй функцию хотя бы в браузере и Electron; mobile — эмуляция viewport в браузере + честная пометка, что на устройстве не проверено.
- Значения в этой таблице — ориентиры на момент сборки skill; при сомнении проверь актуальную документацию API/plugin.
