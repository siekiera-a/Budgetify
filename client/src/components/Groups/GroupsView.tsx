import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { FAB } from "react-native-paper";
import { SafeAreaView } from "../../ui";
import { StackNavigationParamList } from "../navigation/types";

type Props = {
  navigation: StackNavigationProp<StackNavigationParamList>;
};

export function GroupsView({ navigation }: Props) {
  const openCreateGroupView = () => navigation.push("CreateGroup");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FAB
        icon="plus"
        style={{ position: "absolute", right: 0, bottom: 0, margin: 16 }}
        onPress={openCreateGroupView}
      />
    </SafeAreaView>
  );
}
