import { RouteProp } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "../../ui";
import { StackNavigationParamList } from "../navigation/types";

type Props = {
  route: RouteProp<StackNavigationParamList, "SettlementCreator">;
};

export function SettlementCreator({ route }: Props) {
  const {users} = route.params;

  return (
    <SafeAreaView>
      <Text>Creator</Text>
    </SafeAreaView>
  );
}
