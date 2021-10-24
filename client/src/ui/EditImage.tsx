import React from "react";
import { Avatar as PaperAvatar } from "react-native-paper";
import { AvatarComponent as Avatar } from "./Avatar";
import { StyleSheet, View, ViewProps } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type Props = {
  image?: string | null;
  size: number;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
} & Pick<ViewProps, "style">;

export function EditImage({
  image,
  size,
  backgroundColor,
  color,
  style,
  borderColor,
}: Props) {
  const styles = makeStyles({ backgroundColor, borderColor });

  return (
    <View style={[style, styles.wrapper]}>
      {image ? (
        <Avatar avatar={image} name="" size={size} />
      ) : (
        <PaperAvatar.Icon
          icon="camera-off"
          size={size}
          style={styles.icon}
          color={color}
        />
      )}
      <PaperAvatar.Icon
        icon={(props) => <MaterialIcons name="edit" {...props} />}
        size={size / 3.5}
        style={styles.smallIcon}
      />
    </View>
  );
}

type StyleProps = Pick<Props, "backgroundColor" | "borderColor">;

const makeStyles = ({ borderColor, backgroundColor }: StyleProps) => {
  return StyleSheet.create({
    wrapper: {
      alignSelf: "center",
      position: "relative",
    },
    icon: {
      backgroundColor,
    },
    smallIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      borderWidth: 2,
      borderRadius: 50,
      borderColor,
      backgroundColor,
    },
  });
};
