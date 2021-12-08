import React from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { User } from "../../../libs";
import { Avatar } from "../../../ui";

type Props = {
  user: User;
  icon?: React.ReactNode;
};

export function UserListItem({ user, icon }: Props) {
  return (
    <List.Item
      title={user.name}
      left={() => {
        return (
          <Avatar
            name={user.name}
            avatar={user.avatar}
            size={50}
            style={styles.item}
          />
        );
      }}
      right={icon ? () => icon : undefined}
      style={{ paddingVertical: 5 }}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    alignSelf: "center",
    marginRight: 10,
  },
});
