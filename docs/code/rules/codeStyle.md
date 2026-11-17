# Code Style

Правила стиля кода в `blind`.

## 1. Именование директорий

1. Директории пишутся в `camelCase`.
2. Имена директорий отражают функциональную область или модуль.

Примеры:

- `app`
- `shared`
- `ui`

## 2. Именование файлов

1. Файлы пишутся в `camelCase`.
2. Vue-компоненты обычно пишутся в `PascalCase`.
3. Правила с префиксами `View`, `Layout`, `Widget`, `Ui` и `App` относятся именно к файлам Vue-компонентов.

Типичные суффиксы файлов:

- `.vue` - Vue-компоненты;
- `.ts` - логика, типы, сторы, утилиты;
- `.service.ts` - сервисы;
- `.store.ts` - Pinia store;
- `.types.ts` - типы;
- `.constants.ts` или `.const.ts` - константы;
- `.actions.ts` или папка `actions/` - действия;
- `.model.ts` - модели.

Примеры:

- `ViewUser.vue`
- `LayoutMain.vue`
- `WidgetUser.vue`
- `UiUser.vue`
- `AppModal.vue`
- `loadFirstPage.ts`
- `api.service.ts`
- `User.model.ts`

Примеры именования сущностей с префиксом:

- `ViewUser.vue`
- `LayoutMain.vue`
- `WidgetUser.vue`
- `UiUser.vue`
- `AppTitle.vue`
- `AppModal.vue`
- `ModelUser`
- `ServiceUser`

## 3. Константы

1. Константы пишутся в `UPPER_SNAKE_CASE`.
2. Для объектных словарей часто используется `as const`.
3. Типы на основе словарей выводятся через `keyof typeof`.

Примеры:

```ts
export const TAB_KEYS = {
  home: 'home',
  catalog: 'catalog',
} as const;

export type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];
```

## 4. Переменные и функции

1. Переменные и функции пишутся в `camelCase`.
2. Функции-обработчики часто начинаются с `handle`.
3. Фабрики и action-creator функции часто начинаются с `create`.
4. Composable-функции начинаются с `use`.
5. Булевы значения обычно имеют префиксы `is`, `has`, `can`, `should`.
6. Функции получения данных или состояния могут начинаться с `get`.
7. Функции установки или обновления значения могут начинаться с `set` или `update`.
8. Асинхронные функции именуются по смыслу действия и не требуют специального префикса вроде `async`.
9. Название переменной должно отражать ее роль, а не быть слишком общим.

Примеры:

- `handleBack`
- `createShowToast`
- `useProfileOrders`
- `isSuccess`
- `hasBirthday`
- `canSubmitOrder`
- `getCurrentUser`
- `setThemeMode`
- `updateProfile`
- `fetchGameSession`
- `selectedLevel`
- `currentRouteName`

## 5. Типы, интерфейсы и классы

1. `type`, `interface` и `class` пишутся в `PascalCase`.
2. Для `interface` в начале имени используется префикс `i`.
3. Для `type` в начале имени используется префикс `t`.
4. Исключение для props компонента - используется префикс `Props` без `i`: `Props<ИмяКомпонента>` для компонента (`PropsAppButton`) и `Props<Смысл>` для общих фрагментов props (`PropsWidth`). Подробнее - в разделе «Props компонентов».
5. Интерфейсы описывают форму данных или props.
6. Типы используются для union-типов, алиасов и выводимых типов.
7. Классы используются для доменных моделей и сервисов.
8. Если сущность является моделью или сервисом, в ее имени используется смысловой префикс.
9. Локальные интерфейсы, нужные только одному компоненту или экрану, можно оставлять рядом с ним.

Примеры:

- `interface PropsAppButton`
- `interface PropsWidth`
- `interface iUserActions`
- `interface iUserAddress`
- `type tLoadState`
- `type tKeyActionUser`
- `class ModelUser`
- `class ServiceUser`

## 6. Vue-компоненты

1. Используется `<script setup lang="ts">`.
2. Props описываются через `interface Props<ИмяКомпонента>` по правилам раздела «Props компонентов».
3. Значения по умолчанию задаются через `withDefaults`.
4. События описываются через `defineEmits`.
5. Импорты типов пишутся через `import type`.
6. Экраны приложения именуются с префиксом `View`.
7. Layout-компоненты именуются с префиксом `Layout`.
8. UI-компоненты именуются с префиксом `Ui`.
9. Widget-компоненты именуются с префиксом `Widget`.
10. Общие переиспользуемые компоненты именуются с префиксом `App` независимо от того, лежат ли они в `ui`, `widget` или в другой общей директории.
11. Если интерфейсы нужны только конкретной вью или компоненту, они остаются рядом с ним в этом же файле.

Пример:

```vue
<script setup lang="ts">
interface iUserActions {
  openProfile: () => void;
}

export interface PropsWidgetUser {
  actions: iUserActions;
  visible?: boolean;
}

const props = withDefaults(defineProps<PropsWidgetUser>(), {
  visible: false,
});
</script>
```

### Props компонентов

#### Именование и экспорт

1. Интерфейс props называется `Props<ИмяКомпонента>`: `PropsAppButton`, `PropsAppCardHold`, `PropsWidgetSteps`.
2. Props переиспользуемых компонентов экспортируются (`export interface`), чтобы родители могли собирать из них свои типы.
3. Короткое имя `interface Props` допустимо только для локального компонента, чьи props никто не импортирует.
4. Если тип группы `options*` выносится отдельно, он экспортируется и именуется от компонента: `tAppButtonTextOptions`.

#### Общие фрагменты props

Повторяющиеся группы props описаны в `src/app/shared/types/props/*.props.ts`: размеры (`PropsWidth`, `PropsHeight`), вариант размера (`PropsSizeVariant`), взаимодействие (`PropsDisabled`, `PropsSelectionFeedback`), отступы, поверхность, типографика, доступность, анимация.

1. Компонент расширяет нужные фрагменты через `extends`, а не описывает те же поля заново.
2. Новый фрагмент добавляется в `shared/types/props`, только если он нужен нескольким компонентам. Значения из дизайн-системы проходят через contracts (см. [CSS Style](./cssStyle.md)).

```ts
export interface PropsAppCardHold extends PropsWidth, PropsSizeVariant, PropsDisabled {
  // ...
}
```

#### Верхний уровень: характеристики самого компонента

Всё, что относится к самому компоненту, лежит на верхнем уровне props: основное значение, состояние, вариант, размер, ширина, отступы, поверхность, `disabled`, поведение, доступность. Повторяющиеся характеристики подключаются через `extends` общих фрагментов.

Характеристики самого компонента не прячутся в группы вроде `optionsLayout`, `optionsSurface`, `optionsBehavior` или `optionsAccessibility`: ширина кнопки — это свойство кнопки, а не вложенной части.

#### Группы `options*`: настройки вложенного компонента

Группа `options<Имя>` нужна, чтобы по коду сразу было видно, **какой вложенный компонент** можно настроить снаружи и **какие именно его поля**.

1. Имя группы указывает на вложенный компонент: `optionsCard` → `AppCard`, `optionsHold` → `AppHoldAction`, `optionsText` → `AppText`, `optionsIcon` → `AppIcon`.
2. Тип группы строится от экспортированных props этого компонента через `Omit` или `Pick`. Тогда по типу видно, откуда поля, и они не расходятся с самим компонентом.
3. Из группы исключаются свойства, которыми управляет родитель: общее состояние (`disabled`, `size`), размеры, которые родитель задаёт сам, значения, которые вычисляются внутри (`isActive`, `progressRatio`). Так их нельзя переопределить снаружи и они не дублируются на двух уровнях.
4. Общее состояние родителя и вложенного компонента задаётся один раз на родителе и передаётся вниз явно. Например, `disabled` кнопки передаётся и в саму `<button>`, и в `AppInteractionScale`.
5. Полный интерфейс props дочернего компонента не наследуется ради передачи его параметров.
6. Самостоятельная часть сложного компонента без собственного компонента (заголовок, тело и подвал модалки, разделители списка, точки слайдера) может иметь свою группу `options<Часть>`, собранную из общих фрагментов props. Корень самого компонента такой группой не описывается — его характеристики на верхнем уровне.
7. Вложенность не создаётся ради единообразия: если настройка одна и относится к самому компоненту, она остаётся на верхнем уровне.

Пример (`AppCardHold`):

```ts
export interface PropsAppCardHold extends PropsWidth, PropsSizeVariant, PropsDisabled {
  // width, maxWidth и size задаёт AppCardHold — их нет в optionsCard
  optionsCard?: Omit<PropsAppCard, 'width' | 'maxWidth' | 'size'>;
  // width, maxWidth и disabled задаёт AppCardHold — их нет в optionsHold
  optionsHold?: Omit<PropsAppHoldAction, 'width' | 'maxWidth' | 'disabled'>;
  // isActive и progressRatio вычисляются внутри — их нет в optionsBloodFill
  optionsBloodFill?: Omit<PropsAppBloodFill, 'isActive' | 'progressRatio'>;
}
```

Неправильно — характеристики самой кнопки спрятаны в группы:

```ts
export interface PropsAppButton extends PropsSizeVariant, PropsDisabled {
  optionsLayout?: PropsWidth & PropsPadding; // ширина и отступы — свойства самой кнопки
  optionsSurface?: PropsSurface; // поверхность — свойство самой кнопки
}
```

Правильно — свои характеристики через `extends`, группы только для вложенных компонентов:

```ts
export interface PropsAppButton extends PropsWidth, PropsPadding, PropsSurface, PropsSizeVariant, PropsDisabled {
  optionsText?: Pick<PropsAppText, 'text' | 'color' | 'fontSize' | 'fontWeight' | 'uppercase' | 'lineHeight'>;
  optionsIcon?: tAppButtonIconOptions;
  variant?: tAppButtonVariant;
}
```

#### Значения по умолчанию для групп

1. В `withDefaults` группа `options*` по умолчанию `undefined`.
2. Значения по умолчанию для полей внутри группы задаются в `computed`, который объединяет переданное и умолчания. Значение, переданное снаружи, имеет приоритет.

```ts
const cardProps = computed<NonNullable<PropsAppCardHold['optionsCard']>>(() => ({
  ...props.optionsCard,
  overflow: props.optionsCard?.overflow ?? 'hidden',
}));
```

#### Передача во вложенный компонент

Группа передаётся через `v-bind`, а свойства, которыми управляет родитель, — явно. Явные props перекрывают значения из группы.

```vue
<AppCard v-bind="cardProps" :size="size" width="100%" max-width="100%">
```

События, слоты и поведение вложенного компонента сохраняются: родитель пробрасывает нужные события и слоты явно.

## 7. CSS

Правила CSS, style tokens, contracts, component styles и устройство `src/app/shared/styles` вынесены в отдельный раздел [CSS Style](./cssStyle.md).

## Импорты

1. Для файлов из `src` следует использовать алиас `@`, если он уместен в текущем файле.
2. Не создавать длинные и хрупкие относительные импорты без необходимости.
3. Не оставлять неиспользуемые импорты.

## Форматирование кода

Правила форматирования кода вынесены в отдельный раздел [Форматирование кода](./codeFormatting.md).
