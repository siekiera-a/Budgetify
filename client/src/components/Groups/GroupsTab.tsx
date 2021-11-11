import {
  CompositeNavigationProp
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp
} from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import { GroupResponse } from "../../libs";
import { SafeAreaView } from "../../ui";
import { StackNavigationParamList } from "../navigation/types";
import { Group } from "./Group";
import { GroupsView } from "./GroupsView";

export type GroupNavigationParamList = {
  Groups: undefined;
  Group: GroupResponse;
};

export type GroupAndMainStackNavigation = CompositeNavigationProp<
  StackNavigationProp<GroupNavigationParamList, "Groups">,
  StackNavigationProp<StackNavigationParamList>
>;

const Stack = createStackNavigator<GroupNavigationParamList>();

export function GroupsTab() {
  return (
    <SafeAreaView style={styles.safearea}>
      <Stack.Navigator
        initialRouteName="Groups"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Groups" component={GroupsView} />
        <Stack.Screen name="Group" component={Group} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
});
