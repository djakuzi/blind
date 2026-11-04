export interface LocaleViewPreGame {
  index: {
    ui: {
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
    modals: Record<string, never>;
  };
}
