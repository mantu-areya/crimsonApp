import React, { useEffect } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeArea } from "../../components/utility/safe-area.component";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "../../features/gcs/screens/Homescreens"

import { createStackNavigator } from '@react-navigation/stack';
import { InspectionsScreen } from "../../features/gcs/screens/InspectionsScreen";
// import { InspectionDetailScreen } from "../../features/gcs/screens/InspectionDetailScreen";
import { CameraScreen } from "../../utilities/camera/CameraScreen"
import InspectionDetails from "../../screens/InspectionDetails";
import Login from "../../screens/auth/Login";
import { AuthContext } from "../../contexts/AuthContext";
import { HomePage } from "../../screens/HomePage";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Schedule from "../../screens/Schedule";
export const AppNavigator = () => {


  const TAB_ICON = {
    Home: "md-home",
    Map: "md-map",
    Schedule: "list-outline",
  };

  const screenOptions = ({ route }) => {
    const iconName = TAB_ICON[route.name];
    return {
      tabBarIcon: ({ size, color }) => (
        <Ionicons name={iconName} size={size} color={color} />
      ),
      tabBarActiveTintColor: "#4B39EF",
      tabBarInactiveTintColor: "#94A1AC",
    };
  };






  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  function HomeStackScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }}
          name="HomeStack" component={HomePage} />
        <Stack.Screen options={{ headerShown: false, }}
          name="InspectionsDetail" component={InspectionDetails} />
        <Stack.Screen options={{ headerShown: false, }}
          name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>

    );
  }

  function AuthStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
      </Stack.Navigator>
    )
  }


  const { isAuth } = React.useContext(AuthContext);


  function getRouteName(route) {
    const rName = getFocusedRouteNameFromRoute(route);
    if (rName === "Home" || rName === "HomeStack"|| rName === undefined) {
      return  "flex";
    }
    return "none";
  }


  return (
    <>
      {
        !isAuth ?
          <AuthStack /> :
          <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
              options={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                  display: getRouteName(route)
                }
              })}
              name="Home"
              component={HomeStackScreen}
            />
            <Tab.Screen
              options={{ headerShown: false }}
              name="Schedule"
              component={Schedule}
            />
          </Tab.Navigator>
      }
    </>
  );
}
