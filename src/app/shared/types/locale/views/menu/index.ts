export interface LocaleViewMenu {
  index: {
    ui: {
      play: string;
      join: string;
      settings: string;
      holdHint: string;
    };
    modals: {
      joinSession: {
        steps: {
          connection: {
            title: string;
          };
          lobby: {
            title: string;
            placeholder: string;
          };
        };
        next: string;
        back: string;
      };
    };
  };
}
