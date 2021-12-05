import { RouteProp, useNavigation } from "@react-navigation/native";
import { useMachine } from "@xstate/react";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Subheading,
  Surface,
  TextInput,
} from "react-native-paper";
import { useHttp, useSettings } from "../../contexts";
import { SafeAreaView, Stack } from "../../ui";
import { ImagePicker } from "../ImagePicker";
import { StackNavigationParamList } from "../navigation/types";
import { AssignUsersWindow } from "./AssignUsersWindow";
import { ImageZone } from "./ImageZone";
import { Items } from "./Items";
import { createSettlementMachine } from "./machine/settlementMachine";
import { UserStatus } from "./machine/model";
import { SettlementItemEditor } from "./SettlementItemEditor";

type Props = {
  route: RouteProp<StackNavigationParamList, "SettlementCreator">;
};

export function SettlementCreator({ route }: Props) {
  const { users, groupId } = route.params;
  const { dictionary } = useSettings();
  const { goBack } = useNavigation();
  const { client } = useHttp();

  const [current, send, service] = useMachine(
    createSettlementMachine({ users, groupId, http: client })
  );

  const assignedUsersRef = useRef([] as UserStatus[]);
  const invoiceNameRef = useRef("");

  const {
    mode,
    photos: photosFromMachine,
    items,
    additionalWindowOpen,
    temporaryItem,
  } = current.context;

  useEffect(() => {
    service.onDone(goBack);
  }, [goBack]);

  const closeWindow = useCallback(() => {
    send("CLOSE_WINDOW");
  }, [send]);

  const closeModal = useCallback(() => {
    send({
      type: "USERS_ASSIGNED",
      users: assignedUsersRef.current,
    });
  }, [send, assignedUsersRef]);

  const onZonePress = useCallback(() => {
    send({ type: "SELECT_PHOTOS" });
  }, [send]);

  const onImagesLoaded = useCallback(
    (images: ImageInfo[]) => {
      send({ type: "IMAGES_LOADED", images });
    },
    [send, current.value]
  );

  const photos = useMemo(() => {
    return photosFromMachine.map((photo) => {
      if (typeof photo === "string") {
        return photo;
      }
      return photo.uri;
    });
  }, [photosFromMachine]);

  const addItem = useCallback(() => {
    send({ type: "CREATE_ITEM" });
  }, [send]);

  const onSubmit = useCallback(() => {
    const name = invoiceNameRef.current.trim();
    send({ type: "SUBMIT", name: name.length > 0 ? name : undefined });
  }, [send, invoiceNameRef]);

  const hideWindow = useCallback(() => {
    send("HIDE_WINDOW");
  }, [send]);

  const editing = current.matches("creatingItem");

  return (
    <SafeAreaView style={styles.container}>
      <Stack space={16} style={styles.stack}>
        <ImageZone onZonePress={onZonePress} photos={photos} send={send} />

        <Surface style={styles.bar}>
          <View>
            <View style={styles.textInputWrapper}>
              <TextInput
                mode="outlined"
                label={dictionary.name}
                style={styles.textInput}
                onChangeText={(text) => (invoiceNameRef.current = text)}
              />
            </View>
            <View style={styles.addBar}>
              <Subheading>{dictionary.items}</Subheading>
              <IconButton
                icon="plus"
                size={20}
                onPress={addItem}
                disabled={editing}
              />
            </View>
          </View>
        </Surface>

        {temporaryItem && (
          <SettlementItemEditor {...temporaryItem} send={send} />
        )}

        <Items send={send} items={items} disableEditing={editing} />

        <Button
          onPress={onSubmit}
          disabled={editing || items.length === 0}
          mode="contained"
        >
          {dictionary.create}
        </Button>
      </Stack>

      <ImagePicker
        visible={additionalWindowOpen && mode === "SELECT_IMAGE"}
        onDismiss={closeWindow}
        onImagesLoaded={onImagesLoaded}
        onOptionPressed={hideWindow}
      />

      <Portal>
        <Modal
          visible={additionalWindowOpen && mode === "SELECT_USERS"}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}
          style={styles.modal}
        >
          {temporaryItem && (
            <AssignUsersWindow
              users={temporaryItem.assignedUsers}
              usersRef={assignedUsersRef}
              onSubmit={closeModal}
            />
          )}
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  stack: {
    flex: 1,
  },
  modalContainer: {
    width: "80%",
    maxHeight: "80%",
  },
  modal: {
    alignItems: "center",
  },
  addBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bar: {
    padding: 8,
    borderRadius: 8,
  },
  textInputWrapper: {
    marginBottom: 8,
  },
  textInput: {
    height: 40,
  },
});
