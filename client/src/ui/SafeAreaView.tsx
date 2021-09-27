import React from "react";
import { useTheme } from "react-native-paper";
import {
  NativeSafeAreaViewProps,
  SafeAreaView as SafeAreaViewComponent,
} from "react-native-safe-area-context";

interface Props extends NativeSafeAreaViewProps {
  children?: React.ReactNode;
}

export function SafeAreaView({ children, style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <SafeAreaViewComponent
      style={[{ backgroundColor: colors.background }, style]}
      {...rest}
    >
      {children}
    </SafeAreaViewComponent>
  );
}
