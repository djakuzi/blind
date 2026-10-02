export interface iPlatformValue<T> {
  value: T;
}

export interface iPlatformActionResult {
  isHandled: boolean;
}

export interface iPlatformSubscription {
  unsubscribe: () => void;
}
