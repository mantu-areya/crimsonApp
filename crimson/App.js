import React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { theme } from "./src/infrastructure";
import { ThemeProvider } from "styled-components";
import { InspectionsContextProvider } from "./src/services/inspections/inspections.contex";
import { VendorFormContextProvider } from "./src/services/context/VendorForm/vendorForm.contex";
import { UploadOfflineData } from "./src/utilities/UploadOfflineData"
import { Navigation } from "./src/infrastructure/navigation";
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContextProvider } from "./src/contexts/AuthContext";


export default function App() {

  const [sfProLoaded] = useFonts({
    'SF_BOLD': require('./assets/fonts/SF_BOLD.ttf'),
    'SF_LIGHT': require('./assets/fonts/SF_LIGHT.ttf'),
  });

  const [urbanistLoaded] = useFonts({
    'URBAN_BOLD': require('./assets/fonts/urbanist/Urbanist-Bold.ttf'),
    'URBAN_MEDIUM': require('./assets/fonts/urbanist/Urbanist-Medium.ttf'),
    'URBAN_REGULAR': require('./assets/fonts/urbanist/Urbanist-Regular.ttf'),
  });

  if (!sfProLoaded || !urbanistLoaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <AuthContextProvider>
            <InspectionsContextProvider>
              <VendorFormContextProvider>
                <UploadOfflineData />
                <Navigation />
              </VendorFormContextProvider>
            </InspectionsContextProvider>
          </AuthContextProvider>
        </SafeAreaProvider>
      </ThemeProvider>
      <ExpoStatusBar style={"inverted"} backgroundColor="#2B243E" />
    </>
  );
}

