import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import { useSettings } from "../../contexts";
import { SafeAreaView } from "../../ui";
import { ForSettlement } from "./ForSettlement";
import { Receivables } from "./Receivables";

type TopTabNavigation = {
  receivables: undefined;
  forSettlement: undefined;
};

const Tab = createMaterialTopTabNavigator<TopTabNavigation>();

export function Payments() {
  const { dictionary } = useSettings();

  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator initialRouteName="receivables">
        <Tab.Screen
          name="receivables"
          component={Receivables}
          options={{ title: dictionary.receivables }}
        />
        <Tab.Screen
          name="forSettlement"
          component={ForSettlement}
          options={{ title: dictionary.forSettlement }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
