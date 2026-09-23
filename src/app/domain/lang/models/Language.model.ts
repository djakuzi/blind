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
  readonly img: DataLanguage['img'];
  readonly version: DataLanguage['version'];
  readonly isDefault: DataLanguage['isDefault'];

  constructor(
    payload: iPayloadModelLanguage,
  ) {
    this.key = payload.key;
    this.name = payload.name;
    this.img = payload.img;
    this.version = payload.version;
    this.isDefault = payload.isDefault;
  }
}