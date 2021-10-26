import { StackScreenProps } from "@react-navigation/stack";
import { useActor } from "@xstate/react";
import React, { useCallback } from "react";
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
import { EditImage, View } from "../../../ui";
import { CreateGroupStackNavigatorParams } from "./GroupCreator";
import { ListItem } from "./ListItem";
import { GroupActor } from "./machines/groupMachine";

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

  return (
    <View style={styles.view}>
      <Surface style={styles.surface}>
        <EditImage
          size={85}
          style={{ marginBottom: 16 }}
          backgroundColor={theme.colors.background}
          borderColor={theme.colors.border}
          image={photo}
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
              <ListItem user={item} icon={<IconButton icon="delete" />} />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <Text style={styles.text}>{dictionary.noMembersYet}</Text>
            )}
          />
        </Surface>
      </View>
      <Button mode="contained">{dictionary.create}</Button>
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
