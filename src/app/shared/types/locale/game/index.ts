export type tLocalePluralCategory =
  | 'zero'
  | 'one'
  | 'two'
  | 'few'
  | 'many'
  | 'other';

export type tLocalePluralForms =
  Partial<Record<tLocalePluralCategory, string>>
  & {
    other: string
  };

interface iLocaleGameMode {
  title: string
  description: string
}

export interface LocaleGame {
  modes: Record<string, iLocaleGameMode>
  format: {
    players: tLocalePluralForms
    rounds: tLocalePluralForms
  }
}
