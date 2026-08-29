# Нативная настройка окружения

В проекте используются локальные файлы для нативных секретов:

- Android:

```bash
android/local.properties
```

- iOS:

```bash
ios/local.xcconfig
```

Файл для iOS обычно создается на основе шаблона:

```bash
cp ios/local.xcconfig.template ios/local.xcconfig
```

Файл для Android должен содержать локальные значения в `android/local.properties`.

Если каких-то значений не хватает, можно запросить готовый файл у команды или отдельно уточнить нужные данные.

# Переменнные окружения