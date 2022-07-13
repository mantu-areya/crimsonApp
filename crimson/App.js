import React, { useEffect } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from 'react-native';
import { theme } from "./src/infrastructure";
import { ThemeProvider } from "styled-components";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeArea } from "./src/components/utility/safe-area.component";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "./src/features/gcs/screens/Homescreens"
import {
  useFonts as useOswald,
  Oswald_400Regular,Oswald_700Bold,Oswald_600SemiBold,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { createStackNavigator } from '@react-navigation/stack';
import { InspectionsScreen } from "./src/features/gcs/screens/InspectionsScreen";
import { InspectionsContextProvider } from "./src/services/inspections/inspections.contex";
import {InspectionDetailScreen} from "./src/features/gcs/screens/InspectionDetailScreen";
import { VendorFormContextProvider } from "./src/services/context/VendorForm/vendorForm.contex";


export default function App() {

  let [oswaldLoaded] = useOswald({
    Oswald_400Regular,
    Oswald_700Bold,Oswald_600SemiBold,
  });

  let [latoLoaded] = useLato({
    Lato_400Regular,
  });

  if (!oswaldLoaded || !latoLoaded) {
    return null;
  }
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
       <HomeStack.Screen   options={{ headerShown: false }}
 name="HomeStack" component={HomeScreen} /> 
        <HomeStack.Screen   options={{ headerShown: false }}
 name="Inspections" component={InspectionsScreen} /> 
         <HomeStack.Screen   options={{ headerShown: false }}
 name="InspectionsDetail" component={InspectionDetailScreen} /> 
      </HomeStack.Navigator>
      
     );
   }


  return (
    <>
      <ThemeProvider theme={theme}>
        <InspectionsContextProvider>
          <VendorFormContextProvider>
        <NavigationContainer>
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
        </NavigationContainer>
        </VendorFormContextProvider>
        </InspectionsContextProvider>
      </ThemeProvider>
      <ExpoStatusBar style={"auto"} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
