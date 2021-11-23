import { StackScreenProps } from "@react-navigation/stack";
import { useActor } from "@xstate/react";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlatList, StyleSheet } from "react-native";
import {
  Button,
  IconButton,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { useSettings } from "../../../contexts";
import { User } from "../../../libs";
import { EditImage, View } from "../../../ui";
import { ImagePicker } from "../../ImagePicker";
import { CreateGroupStackNavigatorParams } from "./GroupCreator";
import { GroupActor } from "./machines/groupMachine";
import { UserListItem } from "./UserListItem";

type Group = {
  name: string;
};

type Props = StackScreenProps<CreateGroupStackNavigatorParams, "Group"> & {
  service: GroupActor;
};

export function CreateGroup({ navigation, service }: Props) {
  const { dictionary, theme } = useSettings();
  const [current, send] = useActor(service);
  const { control } = useForm<Group>({ defaultValues: { name: "" } });
  const [visible, setVisible] = useState(false);

  const { photo, name, members } = current.context;

  const openSearchPeople = useCallback(() => {
    navigation.navigate("SearchPeople");
    send("SEARCH_PEOPLE");
  }, [navigation, send]);

  const setName = useCallback(
    (name: string) => {
      send({ type: "SET_NAME", name });
    },
    [send]
  );

  const onDeletePress = (user: User) => {
    send({ type: "DELETE_USER", user });
  };

  const createGroup = useCallback(() => {
    send("CREATE");
  }, [send]);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onEditImagePress = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const onImagesLoaded = useCallback(
    (data: string[]) => {
      send({ type: "SET_IMAGE", image: data[0] });
    },
    [send]
  );

  return (
    <View style={styles.view}>
      <Surface style={styles.surface}>
        <EditImage
          size={85}
          style={{ marginBottom: 16 }}
          backgroundColor={theme.colors.background}
          borderColor={theme.colors.border}
          image={photo}
          onPress={onEditImagePress}
        />
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, onBlur }, fieldState: { invalid } }) => {
            return (
              <TextInput
                onBlur={onBlur}
                onChangeText={setName}
                value={name}
                ref={ref}
                mode="outlined"
                label={dictionary.groupName}
                error={invalid}
              />
            );
          }}
        />
        <Button
          mode="outlined"
          icon="plus"
          style={styles.addButton}
          onPress={openSearchPeople}
        >
          {dictionary.addMember}
        </Button>
      </Surface>
      <View style={styles.members}>
        <Surface style={styles.membersSurface}>
          <FlatList
            data={members}
            renderItem={({ item }) => (
              <UserListItem
                user={item}
                icon={
                  <IconButton
                    icon="delete"
                    onPress={() => onDeletePress(item)}
                  />
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <Text style={styles.text}>{dictionary.noMembersYet}</Text>
            )}
          />
        </Surface>
      </View>
      <Button mode="contained" onPress={createGroup}>
        {dictionary.create}
      </Button>

      <ImagePicker
        visible={visible}
        onDismiss={dismiss}
        onImagesLoaded={onImagesLoaded}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: 16,
    flex: 1,
  },
  surface: {
    padding: 8,
  },
  membersSurface: {
    paddingVertical: 8,
  },
  addButton: {
    marginTop: 16,
    borderWidth: 1,
  },
  members: {
    marginVertical: 16,
    flex: 1,
  },
  text: {
    textAlign: "center",
  },
});
