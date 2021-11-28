import { RouteProp, useNavigation } from "@react-navigation/core";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, IconButton, Surface, Title } from "react-native-paper";
import { useSettings } from "../../contexts";
import { EditImage } from "../../ui";
import {
  GroupAndMainStackNavigation,
  GroupNavigationParamList,
} from "./GroupsTab";

type Props = {
  route: RouteProp<GroupNavigationParamList, "Group">;
};

export function Group({ route }: Props) {
  const { avatar, name, members } = route.params;
  const { theme } = useSettings();
  const { navigate } = useNavigation<GroupAndMainStackNavigation>();

  const openSettlementCreator = useCallback(
    () => navigate("SettlementCreator", { users: members }),
    [navigate]
  );

  return (
    <View style={styles.viewContainer}>
      <Surface style={styles.groupSurface}>
        <EditImage
          image={avatar}
          size={75}
          backgroundColor={theme.colors.background}
          borderColor={theme.colors.border}
        />
        <View style={styles.groupName}>
          <Title>{name}</Title>
        </View>
        <IconButton
          icon="account-group"
          onPress={() => console.log("members")}
          size={30}
        />
      </Surface>

      <FAB icon="plus" style={styles.fab} onPress={openSettlementCreator} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    padding: 16,
  },
  groupSurface: {
    width: "100%",
    padding: 16,
    elevation: 2,
    borderRadius: 15,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  groupName: {
    marginHorizontal: 20,
    flex: 1,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 16,
  },
});
