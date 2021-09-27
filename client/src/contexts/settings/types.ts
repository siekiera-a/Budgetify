export type Language = "PL";

export type AppTheme = "dark" | "light";

export type Dictionary = Record<StringId, string>;

export type LanguageDictionary = Record<Language, Dictionary>;

export type StringId =
  | "emailLabel"
  | "passwordLabel"
  | "nameLabel"
  | "signIn"
  | "signUp"
  | "requiredField";
