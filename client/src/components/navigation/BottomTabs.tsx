import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSettings } from "../../contexts";
import { AnalasisView } from "../Analasis";
import { GroupsTab } from "../Groups/GroupsTab";
import { Payments } from "../Payments";
import { Settings } from "../Settings";
import { TabNavigationParamList } from "./types";

const Tab = createBottomTabNavigator<TabNavigationParamList>();

export function BottomTabs() {
  const { dictionary } = useSettings();

  return (
    <Tab.Navigator
      initialRouteName="Analysis"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Analysis"
        component={AnalasisView}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" color={color} size={size} />
          ),
          title: dictionary.analysis,
        }}
      />
      <Tab.Screen
        name="Payments"
        component={Payments}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" color={color} size={size} />
          ),
          title: dictionary.payments,
        }}
      />
      <Tab.Screen
        name="GroupsTab"
        component={GroupsTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
          title: dictionary.groups,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
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
