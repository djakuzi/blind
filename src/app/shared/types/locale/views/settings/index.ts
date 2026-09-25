export interface LocaleViewSettings {
  index: {
    ui: {
      title: string;
      theme: string;
      scale: string;
      sound: string;
      language: string;
      accessibilityLabel: string;
      changeTheme: string;
      changeLanguage: string;
    };
    modals: {
      changeLanguage: {
        title: string;
        searchPlaceholder: string;
        emptyText: string;
      };
    };
  };
}
