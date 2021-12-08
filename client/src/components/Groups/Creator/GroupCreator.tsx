import { useNavigation } from "@react-navigation/core";
import { createStackNavigator } from "@react-navigation/stack";
import { useInterpret, useSelector } from "@xstate/react";
import React from "react";
import { useHttp, useSettings } from "../../../contexts";
import { CreateGroup } from "./CreateGroup";
import { createGroupMachine } from "./machines/groupMachine";
import { SearchUsersActor } from "./machines/searchUsersMachine";
import { SearchPeople } from "./SearchPeople";

export type CreateGroupStackNavigatorParams = {
  Group: undefined;
  SearchPeople: undefined;
};

const Stack = createStackNavigator<CreateGroupStackNavigatorParams>();

export function GroupCreator() {
  const { client } = useHttp();
  const { dictionary } = useSettings();
  const { goBack } = useNavigation();
  const service = useInterpret(createGroupMachine(client));
  const searchService = useSelector(
    service,
    ({ context }) => context.searchUsersService
  );
  
  service.onDone(goBack);

  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="Group" options={{ title: dictionary.createGroup }}>
        {(props) => <CreateGroup {...props} service={service} />}
      </Stack.Screen>
      <Stack.Screen
        name="SearchPeople"
        options={{ title: dictionary.searchPeople }}
      >
        {() => <SearchPeople service={searchService as SearchUsersActor} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
