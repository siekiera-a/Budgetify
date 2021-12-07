import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useHttp, useSettings } from "../../contexts";
import { LoginView } from "../authentication/LoginView";
import { RegisterView } from "../authentication/RegisterView";
import { GroupCreator } from "../Groups/Creator/GroupCreator";
import { InvoiceView } from "../Invoice";
import { SettlementCreator } from "../SettlementCreator";
import { BottomTabs } from "./BottomTabs";
import {
  StackAuthenticationNavigationParamList,
  StackNavigationParamList,
} from "./types";

const AuthenticationStack =
  createStackNavigator<StackAuthenticationNavigationParamList>();

const Stack = createStackNavigator<StackNavigationParamList>();

export function Navigation() {
  const { theme, dictionary } = useSettings();
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
          <Stack.Screen
            name="SettlementCreator"
            component={SettlementCreator}
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              title: dictionary.addInvoice,
            }}
          />
          <Stack.Screen
            name="InvoiceView"
            component={InvoiceView}
            options={{
              headerShown: true,
              headerTitleAlign: "center",
              title: dictionary.settlement,
            }}
          />
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
