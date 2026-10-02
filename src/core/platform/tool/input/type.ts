export interface iInputValue<T> {
  value: T;
}

export interface iInputSubscription {
  unsubscribe: () => void;
}

export type tInputMediaQueryChangeCallback = (matches: boolean) => void;

export interface iInputAdapter {
  supportsPointerEvents(): iInputValue<boolean>;
  canHover(): iInputValue<boolean>;
  hasFinePointer(): iInputValue<boolean>;
  hasFineHoverPointer(): iInputValue<boolean>;
  isPrimaryPointerFine(): iInputValue<boolean>;
  onFineHoverPointerChange(callback: tInputMediaQueryChangeCallback): iInputSubscription;
}
