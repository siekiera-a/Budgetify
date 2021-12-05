import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Divider, Surface } from "react-native-paper";
import { Item, SettlementEvents as Events } from "./machine/model";
import { SettlementItem } from "./SettlementItem";

type Props = {
  send: (event: Events) => void;
  items: Item[];
  disableEditing: boolean;
};

export const Items = React.memo(function Items({
  send,
  items,
  disableEditing,
}: Props) {
  const onDelete = useCallback(
    (index: number) => {
      send({ type: "REMOVE", index });
    },
    [send]
  );

  const onEdit = useCallback(
    (index: number) => {
      send({ type: "EDIT", index });
    },
    [send]
  );

  if (items.length === 0) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <FlatList
          data={items}
          renderItem={({ item, index }) => (
            <SettlementItem
              {...item}
              onDelete={() => onDelete(index)}
              onEdit={() => onEdit(index)}
              disableEditing={disableEditing}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          contentContainerStyle={styles.list}
        />
      </Surface>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    borderRadius: 8,
  },
  list: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  divider: {
    marginVertical: 8,
    height: 1,
  },
});
