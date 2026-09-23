import type {
    DataLanguage,
    tKeyLanguage,
} from '../constants/language.const';

export interface iPayloadModelLanguage
    extends DataLanguage {
    key: tKeyLanguage
}

export class ModelLanguage {
    readonly key: tKeyLanguage;
    readonly name: DataLanguage['name'];

    constructor(
        payload: iPayloadModelLanguage,
    ) {
        this.key = payload.key;
        this.name = payload.name;
    }
}