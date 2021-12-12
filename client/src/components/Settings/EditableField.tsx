import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import FeatherIcons from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSettings } from "../../contexts";

export type CloseEditingCallback = () => void;

type Props = {
  title: string;
  value: string;
  onSave(): void;
  onCancel(): void;
  closeEditingRef: React.MutableRefObject<CloseEditingCallback | undefined>;
  children?: React.ReactNode;
};

export function EditableField({
  title,
  value,
  onSave,
  onCancel: onCancelFromProps,
  closeEditingRef,
  children,
}: Props) {
  const [editing, setEditing] = useState(false);
  const { dictionary } = useSettings();

  const toggleEditing = useCallback(() => {
    setEditing((editing) => !editing);
  }, [setEditing]);

  const onCancel = useCallback(() => {
    onCancelFromProps();
    toggleEditing();
  }, [onCancelFromProps, toggleEditing]);

  useEffect(() => {
    closeEditingRef.current = toggleEditing;
  }, [closeEditingRef, toggleEditing]);

  return (
    <View style={[styles.container, editing ? styles.margin : undefined]}>
      {editing ? (
        <React.Fragment>
          <View style={styles.inputWrapper}>{children}</View>
          <View style={styles.centeredRow}>
            <IconButton
              icon={(props) => <MaterialIcons name="check" {...props} />}
              size={buttonSize}
              onPress={onSave}
            />
            <IconButton
              icon={(props) => <FeatherIcons name="x" {...props} />}
              size={buttonSize}
              onPress={onCancel}
            />
          </View>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.row}>
            <Text style={styles.value}>
              {value.length > 0 ? value : dictionary.absence}
            </Text>
            <IconButton
              icon={(props) => <MaterialIcons name="edit" {...props} />}
              size={buttonSize}
              onPress={toggleEditing}
            />
          </View>
        </React.Fragment>
      )}
    </View>
  );
}

const buttonSize = 20;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 12,
    position: "relative",
    bottom: -5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputWrapper: {
    flex: 1,
  },
  centeredRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  margin: {
    marginVertical: 12,
  },
});
