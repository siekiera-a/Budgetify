import { Theme as NavigationTheme } from "@react-navigation/native";

export type Language = "PL";

export type AppTheme = "dark" | "light";

export type Dictionary = Record<StringId, string>;

export type LanguageDictionary = Record<Language, Dictionary>;

export type Colors = Pick<NavigationTheme, "colors"> &
  Pick<ReactNativePaper.Theme, "colors"> & {
    colors: {
      touchableHighlight: string;
    };
  };

export type Theme = Omit<ReactNativePaper.Theme, "colors"> & Colors;

export type StringId =
  | "emailLabel"
  | "passwordLabel"
  | "nameLabel"
  | "signIn"
  | "signUp"
  | "requiredField"
  | "retypedPasswordLabel"
  | "invalidUsername"
  | "invalidEmail"
  | "passwordTooWeak"
  | "passwordsNotEquals"
  | "analysis"
  | "payments"
  | "groups"
  | "settings"
  | "invalidCredentials"
  | "unknownError"
  | "createGroup"
  | "groupName"
  | "create"
  | "addMember"
  | "members"
  | "searchPeople"
  | "search"
  | "noResults"
  | "noMembersYet"
  | "logout"
  | "darkTheme"
  | "camera"
  | "gallery"
  | "addPicture"
  | "delete";
