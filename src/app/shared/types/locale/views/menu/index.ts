export interface LocaleViewMenu {
  index: {
    ui: {
      play: string;
      join: string;
      holdHint: string;
      header: {
        connection: string;
        settings: string;
      };
      matchSetup: {
        accessibilityLabel: string;
        itemAccessibilityLabel: string;
        holdHint: string;
        desktopWheelHint: string;
        desktopSelectHint: string;
        loadError: string;
        loading: string;
        modeOptionsAccessibilityLabel: string;
        connectionTypesAccessibilityLabel: string;
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
