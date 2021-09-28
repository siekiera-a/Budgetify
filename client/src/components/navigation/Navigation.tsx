import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSettings } from "../../contexts";
import { View } from "../../ui";
import { TabNavigationParamList } from "./types";

export const Tab = createBottomTabNavigator<TabNavigationParamList>();

const Component = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tab</Text>
    </View>
  );
};

export function Navigation() {
  const { theme, dictionary } = useSettings();

  return (
    <NavigationContainer theme={theme}>
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
          component={Component}
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
    </NavigationContainer>
  );
}
