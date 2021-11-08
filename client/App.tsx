import * as React from "react";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from "./src/components/navigation/Navigation";
import {
  HttpContextProvider,
  SettingsProvider,
  StorageContextProvider,
  useSettings,
} from "./src/contexts";

const AppComponent = () => {
  const { theme } = useSettings();

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <StorageContextProvider>
      <SettingsProvider>
        <HttpContextProvider>
          <AppComponent />
        </HttpContextProvider>
      </SettingsProvider>
    </StorageContextProvider>
  );
}
