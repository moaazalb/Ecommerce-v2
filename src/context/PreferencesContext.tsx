"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import i18n from "@/lib/i18n";
import { Language, PreferencesContextType, Theme } from "@/types/preferences";

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

interface PreferencesProviderProps {
  children: ReactNode;
}

/**
 * Provides the user's theme and language preferences across the application.
 *
 * Preferences are persisted in localStorage and applied to the document
 * so that global styles can respond to theme and language changes.
 *
 * @param {PreferencesProviderProps} props - Provider children.
 * @returns {JSX.Element} The preferences context provider.
 */
export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [language, setLanguageState] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const savedLanguage = localStorage.getItem("language");

      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
      }

      if (savedLanguage === "en" || savedLanguage === "ar") {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

    void i18n.changeLanguage(language);

    try {
      localStorage.setItem("theme", theme);
      localStorage.setItem("language", language);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  }, [theme, language, isInitialized]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      language,
      setTheme,
      toggleTheme,
      setLanguage,
    }),
    [theme, language, setTheme, toggleTheme, setLanguage],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

/**
 * Accesses the shared theme and language preferences.
 *
 * @returns {PreferencesContextType} Current preferences and update functions.
 */
export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider.");
  }

  return context;
}
