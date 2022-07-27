import React, { useContext } from "react";
import { AppNavigator } from "./app.navigator";
import { NavigationContainer } from "@react-navigation/native";


export const Navigation = () => {

  return (
    <NavigationContainer>
       <AppNavigator /> 
    </NavigationContainer>
  );
};
