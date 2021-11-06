import { useFocusEffect } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useHttp, useSettings } from "../../contexts";
import { findGroups, GroupResponse } from "../../libs";
import { SafeAreaView } from "../../ui";
import { StackNavigationParamList } from "../navigation/types";
import { GroupListItem } from "./GroupListItem";

type Props = {
  navigation: StackNavigationProp<StackNavigationParamList>;
};

export function GroupsView({ navigation }: Props) {
  const { client } = useHttp();
  const { dictionary } = useSettings();
  const [groups, setGroups] = useState<GroupResponse[]>([]);

  const openCreateGroupView = useCallback(
    () => navigation.push("CreateGroup"),
    [navigation]
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
    <SafeAreaView style={styles.safearea}>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <GroupListItem
            {...item}
            onPress={() => console.log("Pressed")}
          />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
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
