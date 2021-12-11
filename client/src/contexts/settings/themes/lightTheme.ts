import { DefaultTheme as PaperLightTheme } from "react-native-paper";
import { DefaultTheme as NavigationLightTheme } from "@react-navigation/native";
import { Theme } from "../types";

export const lightTheme: Theme = {
  ...PaperLightTheme,
  colors: {
    ...PaperLightTheme.colors,
    ...NavigationLightTheme.colors,
    touchableHighlight: "#ddd",
    green: "#00BA10",
    yellow: "#F5D207",
    red: "#E02121",
  },
};
