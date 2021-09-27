import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RegisterView } from "./src/components/authentication/RegisterView";
import {
  darkTheme,
  lightTheme,
  SettingsProvider,
  useSettings
} from "./src/contexts";

const AppComponent = () => {
  const { theme } = useSettings();

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <RegisterView />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <AppComponent />
    </SettingsProvider>
  );
}
