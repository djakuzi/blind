export type tLoaderScopeKey = string;
export type tLoaderResourceKey = string;

export interface iLoaderErrorAction {
  title: string
  callback: () => void
}

export interface iLoaderResourceError {
  scopeKey: tLoaderScopeKey
  resourceKey: tLoaderResourceKey
  title: string
  description?: string
  action?: iLoaderErrorAction
}

export interface iLoaderScope {
  key: tLoaderScopeKey
  title?: string
  resources: Record<tLoaderResourceKey, boolean>
  isLoaded: boolean
}

export interface iLoaderState {
  scopes: Record<tLoaderScopeKey, iLoaderScope>
  errors: iLoaderResourceError[]
}

export interface iRegisterLoaderScopePayload {
  scopeKey: tLoaderScopeKey
  title?: string
  resources: Record<tLoaderResourceKey, boolean>
}

export interface iSetLoaderResourceStatePayload {
  scopeKey: tLoaderScopeKey
  resourceKey: tLoaderResourceKey
  isLoaded: boolean
}

export type tAddLoaderResourceErrorPayload = iLoaderResourceError;
