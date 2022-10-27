import React, { useEffect, } from "react";
import { InspectionsContextProvider } from "./src/services/inspections/inspections.contex";
import { VendorFormContextProvider } from "./src/services/context/VendorForm/vendorForm.contex";
import { UploadOfflineData } from "./src/utilities/UploadOfflineData"
import { Navigation } from "./src/infrastructure/navigation";
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import * as LocalAuthentication from 'expo-local-authentication';
import { AlertBoX } from './src/utilities/AlertBoX'
import { BackHandler, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const DeviceAuthentication = () => {
  const [authenticationError, setAuthenticationError] = React.useState('')
  const [deviceauthenticated, setDeviceauthenticated] = React.useState()
  const [showImage, setshowImage] = React.useState(true)
  const authenticate = async () => {
    const authenticated = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authentication message"
    });
    if (authenticated.success) {
      console.log("authenticated");
      setshowImage(false)
      setAuthenticationError("None")
    } else {
      setAuthenticationError(authenticated.error)

    }
      setDeviceauthenticated(authenticated)
    }


  useEffect(() => {
    authenticate()
    console.log("opopop");
  }, [])




  return (
    <>
      {showImage &&  <Image style={{ width: '100%', height: '100%', borderRadius: 16 }} source={require("./src/assets/images/splash.png")} />

}
      {
        deviceauthenticated != undefined &&
        (deviceauthenticated.success ? <AuthenticationContextProvider>
          <InspectionsContextProvider>
            <VendorFormContextProvider>
              <UploadOfflineData />
              <Navigation />
            </VendorFormContextProvider>
          </InspectionsContextProvider>
        </AuthenticationContextProvider>
          : deviceauthenticated.error == "user_cancel" && <AlertBoX message={"please verify"}/>
        )
      }
    </>
  )
}