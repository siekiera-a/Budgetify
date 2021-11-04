import { useActor } from "@xstate/react";
import React, { useCallback, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { IconButton, Searchbar, Surface, Text } from "react-native-paper";
import { useSettings } from "../../../contexts";
import { User } from "../../../libs";
import { View } from "../../../ui";
import { UserListItem } from "./UserListItem";
import { SearchUsersActor } from "./machines/searchUsersMachine";

type Props = {
  service: SearchUsersActor;
};

export function SearchPeople({ service }: Props) {
  const { dictionary } = useSettings();
  const [current, send] = useActor(service);

  const { results, term } = current.context;

  const setSearchTerm = useCallback(
    (text: string) => {
      send({ type: "SEARCH", term: text });
    },
    [send]
  );

  const onAddPress = (user: User) => {
    send({ type: "SELECT", user });
  };

  useEffect(() => {
    return () => {
      return send("EXIT");
    };
  }, [send]);

  return (
    <View style={styles.window}>
      <Searchbar
        placeholder={dictionary.search}
        onChangeText={setSearchTerm}
        value={term}
      />
      <View style={styles.resultsView}>
        <Surface style={styles.surface}>
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <UserListItem
                user={item}
                icon={
                  <IconButton icon="plus" onPress={() => onAddPress(item)} />
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <Text style={styles.text}>{dictionary.noResults}</Text>
            )}
          />
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    padding: 16,
    flex: 1,
  },
  text: {
    textAlign: "center",
  },
  resultsView: {
    flex: 1,
  },
  surface: {
    paddingVertical: 8,
    marginTop: 16,
    maxHeight: "100%",
  },
});
