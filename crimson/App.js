import React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { theme } from "./src/infrastructure";
import { ThemeProvider } from "styled-components";
import {
  useFonts as useOswald,
  Oswald_400Regular, Oswald_700Bold, Oswald_600SemiBold,
} from "@expo-google-fonts/oswald";
import { useFonts as useLato, Lato_400Regular } from "@expo-google-fonts/lato";
import { InspectionsContextProvider } from "./src/services/inspections/inspections.contex";
import { VendorFormContextProvider } from "./src/services/context/VendorForm/vendorForm.contex";
import { UploadOfflineData } from "./src/utilities/UploadOfflineData"
import { Navigation } from "./src/infrastructure/navigation";
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function App() {

  const [sfProLoaded] = useFonts({
    'SF_BOLD': require('./assets/fonts/SF_BOLD.ttf'),
    'SF_LIGHT': require('./assets/fonts/SF_LIGHT.ttf'),
  });

  let [oswaldLoaded] = useOswald({
    Oswald_400Regular,
    Oswald_700Bold, Oswald_600SemiBold,
  });

  let [latoLoaded] = useLato({
    Lato_400Regular,
  });

  if (!oswaldLoaded || !latoLoaded || !sfProLoaded) {
    return null;
  }
  const TAB_ICON = {
    Home: "md-home",
    Map: "md-map",
    Settings: "md-settings",
  };

  console.log({sfProLoaded});

  return (
    <>
      <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <InspectionsContextProvider>
          <VendorFormContextProvider>
            <UploadOfflineData />
            <Navigation />
          </VendorFormContextProvider>
        </InspectionsContextProvider>
        </SafeAreaProvider>
      </ThemeProvider>
      <ExpoStatusBar style={"inverted"} backgroundColor="#2B243E" />
    </>
  );
}

