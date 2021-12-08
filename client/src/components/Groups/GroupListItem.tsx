import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Caption, Surface, Text } from "react-native-paper";
import { useSettings } from "../../contexts";
import { GroupResponse } from "../../libs/api";
import { Avatar, AvatarGroup } from "../../ui";

type Props = GroupResponse & {
  onPress: (group: GroupResponse) => void;
};

export function GroupListItem({ onPress: onPressFromProps, ...group }: Props) {
  const { name, avatar, members, owner } = group;
  const users = [
    owner,
    ...members
      .filter((user) => user.id !== owner.id)
      .sort((u1, u2) => {
        return u1.id - u2.id;
      }),
  ];

  const { theme, dictionary } = useSettings();

  const onPress = useCallback(() => {
    onPressFromProps(group);
  }, [group, onPressFromProps]);

  return (
    <Surface style={styles.surface}>
      <TouchableHighlight
        onPress={onPress}
        style={styles.touchable}
        underlayColor={theme.colors.touchableHighlight}
      >
        <View>
          <View style={styles.group}>
            <Avatar name={name} avatar={avatar} size={50} />
            <Text style={styles.groupName}>{name}</Text>
          </View>
          <Caption>{dictionary.members}</Caption>
          <AvatarGroup max={10} users={users} />
        </View>
      </TouchableHighlight>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 5,
    overflow: "hidden",
  },
  touchable: {
    padding: 8,
  },
  group: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  groupName: {
    marginLeft: 10,
    fontSize: 18,
  },
});
