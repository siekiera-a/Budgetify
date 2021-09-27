import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";
import { darkTheme } from "./themes/darkTheme";
import { lightTheme } from "./themes/lightTheme";
import pl from "./strings/pl";
import {
  AppTheme,
  Dictionary,
  Language,
  LanguageDictionary,
  Theme,
} from "./types";

export interface SettingsContext {
  setLanguage(lang: Language): void;
  setTheme(theme: AppTheme): void;
  dictionary: Dictionary;
  clearSettings(): void;
  theme: Theme;
}

export interface SettingsContextProps {
  children?: React.ReactNode;
}

const defaultTheme = Appearance.getColorScheme() as AppTheme;

const defaultValue: SettingsContext = {
  setLanguage: () => void 0,
  setTheme: () => void 0,
  dictionary: pl,
  clearSettings: () => void 0,
  theme: defaultTheme === "dark" ? darkTheme : lightTheme,
};

const settingsContext = createContext<SettingsContext>(defaultValue);

const { Provider } = settingsContext;

const THEME_PERSISTENT_KEY = "THEME_KEY";
const LANGUAGE_PERSISTENT_KEY = "LANGUAGE_KEY";

const defaultLanguage: Language = "PL";

const languageDictionary: LanguageDictionary = {
  PL: pl,
};

export function SettingsProvider({ children }: SettingsContextProps) {
  const [theme, setTheme] = useState(defaultTheme);
  const [language, setLanguage] = useState(defaultLanguage);
  const [initialized, setInitialized] = useState(false);

  const {
    getItem: getTheme,
    setItem: persistTheme,
    removeItem: removeTheme,
  } = useAsyncStorage(THEME_PERSISTENT_KEY);

  const {
    getItem: getLanguage,
    setItem: persistLanguage,
    removeItem: removeLanguage,
  } = useAsyncStorage(LANGUAGE_PERSISTENT_KEY);

  useEffect(() => {
    const initialize = async () => {
      const savedTheme = await getTheme();
      if (savedTheme) {
        const theme = savedTheme as AppTheme;
        setTheme(theme);
      }

      const savedLanguage = await getLanguage();
      if (savedLanguage) {
        const language = savedLanguage as Language;
        setLanguage(language);
      }

      setInitialized(true);
    };

    initialize();
  }, []);

  useEffect(() => {
    if (initialized) {
      persistTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (initialized) {
      persistLanguage(language);
    }
  }, [language]);

  const clearSettings = useCallback(() => {
    removeTheme();
    removeLanguage();
  }, [removeLanguage, removeTheme]);

  const dictionary = useMemo(() => languageDictionary[language], [language]);

  return (
    <Provider
      value={{
        setTheme,
        setLanguage,
        dictionary,
        clearSettings,
        theme: theme === "dark" ? darkTheme : lightTheme,
      }}
    >
      {children}
    </Provider>
  );
}

export function useSettings() {
  return useContext(settingsContext);
}
