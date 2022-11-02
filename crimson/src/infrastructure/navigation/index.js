import React, { useContext } from "react";
import { AccountNavigator } from "./account.navigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { DeviceAuthentication } from "../../services/authentication/DeviceAuthentication";


export const Navigation = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);

  return (
    <NavigationContainer>
        {isAuthenticated ? <DeviceAuthentication /> : <AccountNavigator />} 
    </NavigationContainer>
  );
};
