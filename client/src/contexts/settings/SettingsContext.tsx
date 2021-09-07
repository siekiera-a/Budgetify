import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppTheme, Dictionary, Language, LanguageDictionary } from "./types";
import pl from "./strings/pl";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export interface SettingsContext {
  setLanguage(lang: Language): void;
  setTheme(theme: AppTheme): void;
  dictionary: Dictionary;
  clearSettings(): void;
}

export interface SettingsContextProps {
  children?: React.ReactNode;
}

const defaultValue: SettingsContext = {
  setLanguage: () => void 0,
  setTheme: () => void 0,
  dictionary: pl,
  clearSettings: () => void 0,
};

export const settingsContext = createContext<SettingsContext>(defaultValue);

const { Provider } = settingsContext;

const THEME_PERSISTENT_KEY = "THEME_KEY";
const LANGUAGE_PERSISTENT_KEY = "LANGUAGE_KEY";

const defaultTheme: AppTheme = "dark";
const defaultLanguage: Language = "PL";

const languageDictionary: LanguageDictionary = {
  PL: pl,
};

export function SettingsContextProvider({ children }: SettingsContextProps) {
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
    setTheme("dark");
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialized) {
      persistTheme(theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    if (initialized) {
      persistLanguage(language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      }}
    >
      {children}
    </Provider>
  );
}
