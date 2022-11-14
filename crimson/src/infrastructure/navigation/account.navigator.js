import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {OtpScreen} from "../../screens/auth/OtpScreen"

import Login from "../../screens/auth/Login";

const Stack = createStackNavigator();

export const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
    <Stack.Screen name="OtpScreen" options={{ headerShown: false }} component={OtpScreen} />
  </Stack.Navigator>
);
