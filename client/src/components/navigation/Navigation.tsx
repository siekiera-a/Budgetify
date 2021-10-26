import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useHttp, useSettings } from "../../contexts";
import { LoginView } from "../authentication/LoginView";
import { RegisterView } from "../authentication/RegisterView";
import { GroupCreator } from "../Groups/Creator/GroupCreator";
import { BottomTabs } from "./BottomTabs";
import {
  StackAuthenticationNavigationParamList,
  StackNavigationParamList
} from "./types";

const AuthenticationStack =
  createStackNavigator<StackAuthenticationNavigationParamList>();

const Stack = createStackNavigator<StackNavigationParamList>();

export function Navigation() {
  const { theme } = useSettings();
  const { loggedIn } = useHttp();

  return (
    <NavigationContainer theme={theme}>
      {loggedIn ? (
        <Stack.Navigator
          initialRouteName="App"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="App" component={BottomTabs} />
          <Stack.Screen name="CreateGroup" component={GroupCreator} />
        </Stack.Navigator>
      ) : (
        <AuthenticationStack.Navigator
          initialRouteName="SignIn"
          screenOptions={{ headerShown: false }}
        >
          <AuthenticationStack.Screen name="SignIn" component={LoginView} />
          <AuthenticationStack.Screen name="SignUp" component={RegisterView} />
        </AuthenticationStack.Navigator>
      )}
    </NavigationContainer>
  );
}
