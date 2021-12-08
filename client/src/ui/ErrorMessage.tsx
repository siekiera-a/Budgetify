import React from "react";
import { TextProps } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface Props extends TextProps {
  message: string;
  theme?: ReactNativePaper.Theme;
}

export function ErrorMessage({ message, style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <Text style={[{ color: colors.error }, style]} {...rest}>
      {message}
    </Text>
  );
}
