import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Subheading } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { formatPrice } from "../../libs";
import { AvatarGroup, Stack } from "../../ui";
import { Item } from "./machine/model";

type Props = Item & {
  onDelete: () => void;
  onEdit: () => void;
  disableEditing: boolean;
};

export function SettlementItem({
  name,
  price,
  assignedUsers,
  onDelete,
  onEdit,
  disableEditing,
}: Props) {
  const users = useMemo(
    () => assignedUsers.filter((user) => user.checked).map((user) => user.user),
    [assignedUsers]
  );

  return (
    <Stack space={5}>
      <View style={styles.row}>
        <Subheading>{name}</Subheading>
        <Subheading>{formatPrice(price)} zł</Subheading>
      </View>
      <View style={[styles.row, styles.alignedVeritcally]}>
        <AvatarGroup
          max={8}
          avatarSize={25}
          users={users}
        />
        <View style={styles.buttonContainer}>
          <IconButton
            icon={(props) => <MaterialIcons {...props} name="edit" />}
            size={buttonSize}
            onPress={onEdit}
            disabled={disableEditing}
          />
          <IconButton icon="delete" size={buttonSize} onPress={onDelete} />
        </View>
      </View>
    </Stack>
  );
}

const buttonSize = 18;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  alignedVeritcally: {
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
