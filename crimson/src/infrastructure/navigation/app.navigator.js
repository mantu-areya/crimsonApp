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
  const Stack = createStackNavigator();

  function HomeStackScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }}
          name="HomeStack" component={HomeScreen} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Inspections" component={InspectionsScreen} />
        <Stack.Screen options={{ headerShown: false, }}
          name="InspectionsDetail" component={InspectionDetails} />
        <Stack.Screen options={{ headerShown: false, }}
          name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>

    );
  }

  // function AuthStack() {
  //   return (
  //     <Stack.Navigator>
  //       <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
  //     </Stack.Navigator>
  //   )
  // }



  return (
    <>
      {/* {
        !isAuth ?
          <AuthStack /> : */}
          <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
              options={{
                headerShown: false, tabBarStyle: {
                  display: 'none'
                }
              }}
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
      {/* } */}
    </>
  );
}
