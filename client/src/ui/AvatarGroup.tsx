import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { User } from "../libs";
import { AvatarComponent as Avatar } from "./Avatar";

type Props = {
  users: User[];
  max: number;
  avatarSize?: number;
};

export function AvatarGroup({
  users: usersFromProps,
  max,
  avatarSize = 30,
}: Props) {
  const users = usersFromProps.slice(0, max);
  const hiddenAvatarsCount = usersFromProps.length - max;
  const translate = avatarSize * 0.25;

  return (
    <ScrollView style={styles.container} horizontal>
      {users.map((user, index) => (
        <Avatar
          name={user.name}
          avatar={user.avatar}
          key={user.id}
          style={{ transform: [{ translateX: -index * translate }] }}
          size={avatarSize}
          labelStyle={styles.avatarLabelStyle}
        />
      ))}
      {hiddenAvatarsCount > 0 && (
        <Avatar
          name={`+${hiddenAvatarsCount}`}
          avatar={null}
          size={avatarSize}
          labelStyle={styles.avatarLabelStyle}
          disableNameFormating
          style={{
            transform: [{ translateX: -max * translate }],
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "relative",
  },
  avatarLabelStyle: {
    fontSize: 12,
  },
});
