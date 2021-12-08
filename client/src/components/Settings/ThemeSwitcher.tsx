import React, { useCallback, useState } from "react";
import { Switch } from "react-native-paper";
import { useSettings } from "../../contexts";

export function ThemeSwitcher() {
  const { theme, setTheme } = useSettings();
  const [isSwitchOn, setSwitchOn] = useState(theme.dark);

  const onThemeChange = useCallback(
    (value: boolean) => {
      if (value) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
      setSwitchOn(value);
    },
    [setTheme]
  );

  return <Switch value={isSwitchOn} onValueChange={onThemeChange} />;
}
