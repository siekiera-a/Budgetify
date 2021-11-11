import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useHttp, useSettings } from "../../contexts";
import { findGroups, GroupResponse } from "../../libs";
import { GroupListItem } from "./GroupListItem";
import { GroupAndMainStackNavigation } from "./GroupsTab";

export function GroupsView() {
  const { client } = useHttp();
  const { dictionary } = useSettings();
  const [groups, setGroups] = useState<GroupResponse[]>([]);

  const { navigate, push } = useNavigation<GroupAndMainStackNavigation>();

  const openCreateGroupView = useCallback(
    () => navigate("CreateGroup"),
    [navigate]
  );

  const goToGroup = useCallback(
    (group: GroupResponse) => {
      push("Group", group);
    },
    [push]
  );

  useFocusEffect(
    useCallback(() => {
      const fetchGroups = async () => {
        try {
          const groups = await findGroups(client);
          setGroups(groups);
        } catch (e) {
          console.log(e);
        }
      };
      fetchGroups();
    }, [client, setGroups])
  );

  return (
    <View style={styles.view}>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <GroupListItem {...item} onPress={goToGroup} />
        )}
        keyExtractor={(group) => group.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.text}>{dictionary.noResults}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.container}
      />
      <FAB
        icon="plus"
        style={{ position: "absolute", right: 0, bottom: 0, margin: 16 }}
        onPress={openCreateGroupView}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  text: {
    textAlign: "center",
  },
  separator: {
    height: 8,
  },
});
