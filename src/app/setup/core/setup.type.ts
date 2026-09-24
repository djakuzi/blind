export type tAppSetupExecutionMode =
  | 'blocking'
  | 'background';

export type tAppSetupHandler =
  () => void | Promise<void>;

export interface iAppSetupPostMount {
  mode: tAppSetupExecutionMode
  run: tAppSetupHandler
}

export interface iAppSetup {
  key: string
  preMount?: tAppSetupHandler
  postMount?: iAppSetupPostMount
}
