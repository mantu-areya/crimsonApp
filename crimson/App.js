import React, { useEffect } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { theme } from "./src/infrastructure";
import { ThemeProvider } from "styled-components";
import { InspectionsContextProvider } from "./src/services/inspections/inspections.contex";
import { VendorFormContextProvider } from "./src/services/context/VendorForm/vendorForm.contex";
import { UploadOfflineData } from "./src/utilities/UploadOfflineData"
import { Navigation } from "./src/infrastructure/navigation";
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import { Provider } from "react-native-paper";
import FlashMessage from "react-native-flash-message";



export default function App() {

  const [urbanistLoaded] = useFonts({
    'URBAN_BOLD': require('./assets/fonts/urbanist/Urbanist-Bold.ttf'),
    'URBAN_MEDIUM': require('./assets/fonts/urbanist/Urbanist-Medium.ttf'),
    'URBAN_REGULAR': require('./assets/fonts/urbanist/Urbanist-Regular.ttf'),
  });

  if (!urbanistLoaded) {
    return null;
  }



  return (
    <>
      <ThemeProvider theme={theme}>
        <Provider>
          <AuthenticationContextProvider>
            <SafeAreaProvider>
              <Navigation />
            </SafeAreaProvider>
          </AuthenticationContextProvider>
        </Provider>
      </ThemeProvider>
      <FlashMessage position={"bottom"} />
      <ExpoStatusBar style={"inverted"} backgroundColor="#2B243E" />
    </>
  );
}

