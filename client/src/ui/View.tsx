import React from "react";
import { View as ViewComponent, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

interface Props extends ViewProps {
  children?: React.ReactNode;
}

export function View({ children, style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <ViewComponent
      style={[{ backgroundColor: colors.background }, style]}
      {...rest}
    >
      {children}
    </ViewComponent>
  );
}
