import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, Divider, Surface } from "react-native-paper";
import { AssignUserItem } from "./AssignUserItem";
import { UserStatus } from "./machine/model";

type Props = {
  users: UserStatus[];
  usersRef: MutableRefObject<UserStatus[]>;
  onSubmit: () => void;
};

export function AssignUsersWindow({ users, usersRef, onSubmit }: Props) {
  const [assignedUsers, setAssignedUsers] = useState(users);

  useEffect(() => {
    if (assignedUsers) {
      usersRef.current = assignedUsers;
    }
  }, [assignedUsers, usersRef]);

  const onAssigneeChange = useCallback(
    (value: boolean, userId: number) => {
      setAssignedUsers((data) =>
        data.map((entry) => {
          const id = entry.user.id;
          if (id === userId) {
            return {
              user: entry.user,
              checked: value,
            };
          }
          return entry;
        })
      );
    },
    [setAssignedUsers]
  );

  return (
    <Surface style={styles.surface}>
      <FlatList
        data={assignedUsers}
        renderItem={({ item }) => (
          <AssignUserItem data={item} onChange={onAssigneeChange} />
        )}
        keyExtractor={({ user }) => user.id.toString()}
        ItemSeparatorComponent={() => <Divider style={styles.separator} />}
      />
      <Button onPress={onSubmit} style={styles.button}>
        OK
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    borderRadius: 8,
  },
  separator: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
});
