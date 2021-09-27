import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoginView } from "./src/components/authentication/LoginView";
import { SettingsProvider } from "./src/contexts";

export default function App() {
  return (
    <SettingsProvider>
      <SafeAreaProvider>
        <PaperProvider>
          <LoginView />
        </PaperProvider>
      </SafeAreaProvider>
    </SettingsProvider>
  );
}
