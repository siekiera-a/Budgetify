import random from "lodash/random";
import React from "react";
import { ViewProps } from "react-native";
import { Avatar } from "react-native-paper";

type Props = {
  name: string;
  avatar: string | null;
  size?: number;
} & Pick<ViewProps, "style">;

const stylesMap = [
  { background: "#3f37c9", color: "#fff" },
  { background: "#f72585", color: "#fff" },
  { background: "#d00000", color: "#fff" },
  { background: "#800e13", color: "#fff" },
  { background: "#47e5bc", color: "#000" },
  { background: "#ffba08", color: "#000" },
  { background: "#3a86ff", color: "#000" },
  { background: "#70e000", color: "#000" },
  { background: "#ff6000", color: "#000" },
] as Array<{ background: string; color: string }>;

const formatName = (name: string) => {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].substr(0, 2).toUpperCase();
  }

  return (words[0].substr(0, 1) + words[1].substr(0, 1)).toUpperCase();
};

export const AvatarComponent = React.memo(function AvatarComponent({
  name,
  avatar,
  size = 64,
  style,
}: Props) {
  if (avatar) {
    return <Avatar.Image source={{ uri: avatar }} size={size} style={style} />;
  }

  const styles = stylesMap[random(stylesMap.length - 1)];

  return (
    <Avatar.Text
      label={formatName(name)}
      size={size}
      color={styles.color}
      style={[style, { backgroundColor: styles.background }]}
    />
  );
});
