# Git

| Команда | Назначение |
| --- | --- |
| `git status` | Ветка и изменённые файлы |
| `git check` | Проверка названия ветки |
| `git create feature 123-new-menu` | Создать feature-ветку |
| `git create bugfix 124-input-fix` | Создать bugfix-ветку |
| `git create hotfix 125-crash` | Создать hotfix-ветку |
| `git update` | Обновить локальную `development` через fast-forward |

Создание ветки требует чистого рабочего дерева и перехода на исходную ветку: `development` для feature/bugfix или `main` для hotfix. `git update` запускается из чистой `development`.

CLI не выполняет автоматический push, force-push или конфликтный merge.
