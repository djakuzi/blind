export type tSetupExecutionMode = 'blocking' | 'background';

export type tSetupHandler = () => void | Promise<void>;

export interface iSetupPostMount {
  mode: tSetupExecutionMode;
  run: tSetupHandler;
}

export interface iSetup {
  key: string;
  preMount?: tSetupHandler;
  postMount?: iSetupPostMount;
}
