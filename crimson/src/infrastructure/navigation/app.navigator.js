import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { createStackNavigator } from '@react-navigation/stack';
import { CameraScreen } from "../../utilities/camera/CameraScreen"
import InspectionDetails from "../../screens/InspectionDetails";
import { HomePage } from "../../screens/HomePage";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Chat from "../../screens/Chat";
import ImageGallery from "../../screens/auth/ImageGallery";
import { TurnHome } from "../../screens/turns/TurnHome";
import TurnDetails from "../../screens/turns/TurnDetails";
export const AppNavigator = () => {


  const TAB_ICON = {
    Inspections: "bookmark-outline",
    Turns: "infinite-outline",
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
        <Stack.Screen options={{ headerShown: false, }}
          name="Chat" component={Chat} />
        <Stack.Screen options={{ headerShown: false, }}
          name="ImageGallery" component={ImageGallery} />
      </Stack.Navigator>

    );
  }


  function TurnStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }}
          name="TurnHome" component={TurnHome} />
        <Stack.Screen options={{ headerShown: false, }}
          name="TurnDetails" component={TurnDetails} />
        <Stack.Screen options={{ headerShown: false, }}
          name="CameraScreen" component={CameraScreen} />
        <Stack.Screen options={{ headerShown: false, }}
          name="Chat" component={Chat} />
        <Stack.Screen options={{ headerShown: false, }}
          name="ImageGallery" component={ImageGallery} />
      </Stack.Navigator>

    );
  }




  function getRouteName(route) {
    const rName = getFocusedRouteNameFromRoute(route);
    if (rName === "TurnHome" || rName === "HomeStack" || rName === undefined) {
      return "flex";
    }
    return "none";
  }


  return (
    <>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          options={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              display: getRouteName(route)
            }
          })}
          name="Inspections"
          component={HomeStackScreen}
        />
        <Tab.Screen
          options={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              display: getRouteName(route)
            }
          })}
          name="Turns"
          component={TurnStack}
        />

      </Tab.Navigator>
    </>
  );
}
