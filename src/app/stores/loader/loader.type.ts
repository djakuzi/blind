import type { tAppLoadingStatus } from '@/app/shared/types/status';

export type tLoaderScopeKey = string;
export type tLoaderResourceKey = string;

export interface iLoaderErrorAction {
  title: string;
  callback: () => void | Promise<void>;
}

export interface iLoaderResourceError {
  title: string;
  description?: string;
  action?: iLoaderErrorAction;
}

export interface iLoaderResource {
  state: tAppLoadingStatus;
  error?: iLoaderResourceError;
}

export interface iLoaderScope {
  key: tLoaderScopeKey;
  title?: string;
  resources: Record<tLoaderResourceKey, iLoaderResource>;
}

export interface iLoaderState {
  scopes: Record<tLoaderScopeKey, iLoaderScope>;
}

export interface iRegisterLoaderScopePayload {
  scopeKey: tLoaderScopeKey;
  title?: string;
  resources: Record<tLoaderResourceKey, tAppLoadingStatus>;
}

export interface iLoaderResourcePayload {
  scopeKey: tLoaderScopeKey;
  resourceKey: tLoaderResourceKey;
}

export interface iSetLoaderResourceErrorPayload extends iLoaderResourcePayload {
  error: iLoaderResourceError;
}
