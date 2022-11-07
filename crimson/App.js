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
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCFLpOHzySZk_bngknbxy1jLOuaOZsY8pg",
  authDomain: "crimsonapp-9d439.firebaseapp.com",
  databaseURL: "https://crimsonapp-9d439-default-rtdb.firebaseio.com",
  projectId: "crimsonapp-9d439",
  storageBucket: "crimsonapp-9d439.appspot.com",
  messagingSenderId: "219761954692",
  appId: "1:219761954692:web:08a54ec6415a253bf1d7d1",
  measurementId: "G-5HBE0SZB2S"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


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
      <AuthenticationContextProvider>
        <SafeAreaProvider>
          <Navigation/>
        </SafeAreaProvider>
        </AuthenticationContextProvider>
      </ThemeProvider>
      <ExpoStatusBar style={"inverted"} backgroundColor="#2B243E" />
    </>
  );
}

