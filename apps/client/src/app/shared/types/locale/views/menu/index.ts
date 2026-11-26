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
      onlineEntry: { title: string; create: string; quickMatch: string; demo: string };
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
        code: string;
        demoDevice: string;
        demo: string;
        next: string;
        back: string;
      };
    };
  };
}
