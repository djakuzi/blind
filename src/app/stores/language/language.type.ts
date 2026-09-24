import type { Locale } from '@/app/shared/types/locale';
import type { ModelLanguage } from '@/app/domain/lang/models/Language.model';

export interface iLanguageFile {
  version: string
  locale: Locale
}

export interface iLanguageState {
  languages: ModelLanguage[]
  preferredLanguageCode: string | null
  currentLanguage: ModelLanguage | null
  locale: Locale | null
  isInitialized: boolean
}
