export interface LocaleViewMenu {
  index: {
    ui: {
      join: string;
      header: {
        connection: string;
        settings: string;
      };
      matchSetup: {
        accessibilityLabel: string;
        itemAccessibilityLabel: string;
        players: string;
        connection: string;
      };
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
