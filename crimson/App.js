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
export default function App() {

  let [oswaldLoaded] = useOswald({
    Oswald_400Regular,
    Oswald_700Bold, Oswald_600SemiBold,
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

  return (
    <>
      <ThemeProvider theme={theme}>
        <InspectionsContextProvider>
          <VendorFormContextProvider>
            <UploadOfflineData />
            <Navigation />
          </VendorFormContextProvider>
        </InspectionsContextProvider>
      </ThemeProvider>
      <ExpoStatusBar style={"auto"} />
    </>
  );
}

