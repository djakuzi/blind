# Project / Doctor

| Команда | Назначение |
| --- | --- |
| `project info` | Название, версия, Node.js и ОС |
| `project status` | Ветка, изменения файлов и зависимости |
| `project versions` | Версии инструментов и пакетов |
| `project env` | Наличие обязательных ключей в файлах окружения |
| `project doctor` | Проверка базового Web-окружения |
| `project doctor desktop` | Проверка Desktop-окружения |
| `project doctor android` | Проверка Android-окружения |
| `project doctor ios` | Проверка iOS-окружения |

Пример: `npm run cli -- project doctor android`.

Диагностика не выводит значения секретов. Недостающие требования обозначаются как ошибки.
