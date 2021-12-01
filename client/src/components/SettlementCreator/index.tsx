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
} from "react-native-paper";
import { useSettings, useStorage } from "../../contexts";
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
  const { users } = route.params;
  const { profile } = useStorage();
  const { dictionary } = useSettings();
  const { goBack } = useNavigation();

  const [current, send, service] = useMachine(
    createSettlementMachine({ users, creator: profile?.id || -1 })
  );

  const assignedUsersRef = useRef([] as UserStatus[]);

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
    send("SUBMIT");
  }, [send]);

  const hideWindow = useCallback(() => {
    send("HIDE_WINDOW");
  }, [send]);

  const editing = current.matches("creatingItem");

  return (
    <SafeAreaView style={styles.container}>
      <Stack space={16} style={styles.stack}>
        <ImageZone onZonePress={onZonePress} photos={photos} send={send} />

        <Surface style={styles.bar}>
          <View style={styles.addBar}>
            <Subheading>{dictionary.items}</Subheading>
            <IconButton
              icon="plus"
              size={20}
              onPress={addItem}
              disabled={editing}
            />
          </View>
        </Surface>

        {temporaryItem && (
          <SettlementItemEditor {...temporaryItem} send={send} />
        )}

        <Items send={send} items={items} disableEditing={editing} />

        <Button onPress={onSubmit} disabled={editing} mode="contained">
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
});
