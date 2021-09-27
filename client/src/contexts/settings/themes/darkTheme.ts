import { DarkTheme as PaperDarkTheme } from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import { Theme } from "../types";



export const darkTheme: Theme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};
