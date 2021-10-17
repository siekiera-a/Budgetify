import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Text } from "react-native-paper";
import { TabNavigationParamList } from "./types";
import { View } from "../../ui/View";
import { useSettings } from "../../contexts";
import { GroupsView } from "../Groups/GroupsView";

const Tab = createBottomTabNavigator<TabNavigationParamList>();

const Component = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tab</Text>
    </View>
  );
};

export function BottomTabs() {
  const { dictionary } = useSettings();

  return (
    <Tab.Navigator
      initialRouteName="Analysis"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Analysis"
        component={Component}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" color={color} size={size} />
          ),
          title: dictionary.analysis,
        }}
      />
      <Tab.Screen
        name="Payments"
        component={Component}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" color={color} size={size} />
          ),
          title: dictionary.payments,
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsView}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
          title: dictionary.groups,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Component}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
          title: dictionary.settings,
        }}
      />
    </Tab.Navigator>
  );
}
