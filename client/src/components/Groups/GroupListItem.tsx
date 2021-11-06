import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Caption, Surface, Text } from "react-native-paper";
import { useSettings } from "../../contexts";
import { useList } from "../../hooks/useList";
import { GroupResponse } from "../../libs/api";
import { Avatar } from "../../ui";

type Props = GroupResponse & {
  onPress: () => void;
};

export function GroupListItem({ name, avatar, owner, members, onPress }: Props) {
  const fewMembersWithOwner = members
    .filter((member) => member.id !== owner.id)
    .slice(0, 5);

  fewMembersWithOwner.unshift(owner);

  const fewMembers = useList(fewMembersWithOwner);
  const { theme, dictionary } = useSettings();
  const memberAvatarSize = 30;

  const hiddenMembersCount = members.length - fewMembers.length;

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
          <View>
            <Caption>{dictionary.members}</Caption>
            <View style={styles.membersContainer}>
              {fewMembers.map(([member, { isLast }]) => (
                <Avatar
                  name={member.name}
                  avatar={member.avatar}
                  key={member.id}
                  style={
                    !isLast || hiddenMembersCount > 0
                      ? styles.memberAvatar
                      : undefined
                  }
                  size={memberAvatarSize}
                  labelStyle={styles.avatarLabelStyle}
                />
              ))}
              {hiddenMembersCount > 0 && (
                <Avatar
                  name={`+${hiddenMembersCount}`}
                  avatar={null}
                  size={memberAvatarSize}
                  labelStyle={styles.avatarLabelStyle}
                  disableNameFormating
                />
              )}
            </View>
          </View>
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
  membersContainer: {
    flexDirection: "row",
  },
  memberAvatar: {
    marginRight: 8,
  },
  avatarLabelStyle: {
    fontSize: 12,
  },
});
