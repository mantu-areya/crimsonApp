import React, { useEffect } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeArea } from "../../components/utility/safe-area.component";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "../../features/gcs/screens/Homescreens"

import { createStackNavigator } from '@react-navigation/stack';
import { InspectionsScreen } from "../../features/gcs/screens/InspectionsScreen";
import { InspectionDetailScreen } from "../../features/gcs/screens/InspectionDetailScreen";
import { CameraScreen } from "../../utilities/camera/CameraScreen"
export const AppNavigator = () => {


  const TAB_ICON = {
    Home: "md-home",
    Map: "md-map",
    Settings: "md-settings",
  };

  const screenOptions = ({ route }) => {
    const iconName = TAB_ICON[route.name];
    return {
      tabBarIcon: ({ size, color }) => (
        <Ionicons name={iconName} size={size} color={color} />
      ),
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
    };
  };

  const Maps = () => (
    <SafeArea>
      <Text>Maps</Text>
    </SafeArea>
  );

  const Settings = () => (
    <SafeArea>
      <Text>Settings</Text>
    </SafeArea>
  );

  const Home = () => (
    <SafeArea>
      <Text>Home</Text>
    </SafeArea>
  );




  const Tab = createBottomTabNavigator();
  const HomeStack = createStackNavigator();

  function HomeStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen options={{ headerShown: false }}
          name="HomeStack" component={HomeScreen} />
        <HomeStack.Screen options={{ headerShown: false }}
          name="Inspections" component={InspectionsScreen} />
        <HomeStack.Screen options={{ headerShown: false }}
          name="InspectionsDetail" component={InspectionDetailScreen} />
        <HomeStack.Screen options={{ headerShown: false }}
          name="CameraScreen" component={CameraScreen} />
      </HomeStack.Navigator>

    );
  }


  return (
    <>

      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          options={{ headerShown: false }}
          name="Home"
          component={HomeStackScreen}
        />
        <Tab.Screen
          options={{ headerShown: false }}
          name="Settings"
          component={Settings}
        />
        <Tab.Screen
          options={{ headerShown: false }}
          name="Map"
          component={Maps}
        />
      </Tab.Navigator>
    </>
  );
}
