export type tLocalePluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export type tLocalePluralForms = Partial<Record<tLocalePluralCategory, string>> & {
  other: string;
};

interface iLocaleGameModeLocked {
  title: string;
  description: string;
}

interface iLocaleGameMode {
  title: string;
  description: string;
  locked?: iLocaleGameModeLocked;
}

export interface LocaleGame {
  modes: Record<string, iLocaleGameMode>;
  format: {
    players: tLocalePluralForms;
    rounds: tLocalePluralForms;
  };
}
