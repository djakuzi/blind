export interface iPayloadModelLanguage {
  key: string;
  name: string;
  img?: string;
  version: string;
  isDefault: boolean;
}

export class ModelLanguage {
  readonly key: string;
  readonly name: string;
  readonly img?: string;
  readonly version: string;
  readonly isDefault: boolean;

  constructor(payload: iPayloadModelLanguage) {
    this.key = payload.key;
    this.name = payload.name;
    this.img = payload.img;
    this.version = payload.version;
    this.isDefault = payload.isDefault;
  }
}
