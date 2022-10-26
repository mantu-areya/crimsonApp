import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../../screens/auth/Login";

const Stack = createStackNavigator();

export const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);
