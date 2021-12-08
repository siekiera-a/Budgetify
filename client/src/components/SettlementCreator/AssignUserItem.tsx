import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox, Text } from "react-native-paper";
import { Avatar } from "../../ui";
import { UserStatus } from "./machine/model";

type Props = {
  data: UserStatus;
  onChange(value: boolean, index: number): void;
};

export function AssignUserItem({
  data: { user, checked: checkedFromProps },
  onChange,
}: Props) {
  const [checked, setChecked] = useState(checkedFromProps);

  const onPress = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange(newValue, user.id);
  };

  return (
    <View style={styles.container}>
      <Avatar size={35} name={user.name} avatar={user.avatar} />
      <Text style={styles.text}>{user.name}</Text>
      <Checkbox status={checked ? "checked" : "unchecked"} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginHorizontal: 16,
    flex: 1,
  },
});
