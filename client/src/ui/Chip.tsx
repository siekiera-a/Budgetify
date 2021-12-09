import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { useSettings } from "../contexts";

type Props = {
  text: string;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ text, style }: Props) {
  const { theme } = useSettings();
  const styles = makeStyles(theme.colors.primary, theme.colors.text);

  return (
    <View style={[styles.status, style]}>
      <Text style={styles.statusText}>{text}</Text>
    </View>
  );
}

const makeStyles = (backgroundColor: string, textColor: string) =>
  StyleSheet.create({
    status: {
      fontStyle: "italic",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 50,
      backgroundColor: backgroundColor,
    },
    statusText: {
      fontSize: 10,
      color: textColor,
    },
  });
