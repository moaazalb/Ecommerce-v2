export type Theme = "light" | "dark";
export type Language = "en" | "ar";

export interface PreferencesContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
}