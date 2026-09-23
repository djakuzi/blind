import {
    LANGUAGE,
    type tKeyLanguage,
} from '../constants/language.const';

import {
    ModelLanguage,
} from '../models/Language.model';

export class ApiLanguage {
    async getLanguages(): Promise<ModelLanguage[]> {
        const languageKeys =
            Object.keys(LANGUAGE) as tKeyLanguage[];

        return languageKeys.map((key) =>
            new ModelLanguage({
                key,
                ...LANGUAGE[key],
            }),
        );
    }
}

export const apiLanguage = new ApiLanguage();