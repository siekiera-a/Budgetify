import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useHttp, useSettings } from "../../contexts";
import { View } from "../../ui";
import { LoginView } from "../authentication/LoginView";
import { RegisterView } from "../authentication/RegisterView";
import { StackNavigationParamList, TabNavigationParamList } from "./types";

export const Tab = createBottomTabNavigator<TabNavigationParamList>();
export const Stack = createStackNavigator<StackNavigationParamList>();

const Component = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tab</Text>
    </View>
  );
};

export function Navigation() {
  const { theme, dictionary } = useSettings();
  const { loggedIn } = useHttp();

  return (
    <NavigationContainer theme={theme}>
      {loggedIn ? (
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
      ) : (
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignIn" component={LoginView} />
          <Stack.Screen name="SignUp" component={RegisterView} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
