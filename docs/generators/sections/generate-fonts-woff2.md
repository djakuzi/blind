# Генератор WOFF2-шрифтов

## Описание

[Генератор WOFF2-шрифтов](../../../scripts/generators/generateFontsWoff2.js) запускается через команду `npm run app:generate:fonts-woff2`.

Генератор автоматически преобразует исходные `.ttf`-шрифты проекта в формат `.woff2`.

Он рекурсивно сканирует директорию `src/assets/fonts/`, находит все `.ttf`-файлы и создаёт рядом с каждым исходным файлом соответствующий `.woff2`-файл.

Например:

```text
src/assets/fonts/comfortaa/Comfortaa-Medium.ttf