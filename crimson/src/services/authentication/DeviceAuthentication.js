import React, { useEffect, } from "react";
import { InspectionsContextProvider } from "../inspections/inspections.contex";
import { VendorFormContextProvider } from "../context/VendorForm/vendorForm.contex";
import { UploadOfflineData } from "../../utilities/UploadOfflineData"
import { AuthenticationContextProvider } from "./authentication.context";
import * as LocalAuthentication from 'expo-local-authentication';
import { AlertBoX } from '../../utilities/AlertBoX'
import { BackHandler, Image } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppNavigator } from "../../infrastructure/navigation/app.navigator";

export const DeviceAuthentication = () => {
  const [authenticationError, setAuthenticationError] = React.useState('')
  const [deviceauthenticated, setDeviceauthenticated] = React.useState()
  const [showImage, setshowImage] = React.useState(true)
  const authenticate = async () => {
    const authenticated = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock Crimson"
    }).then(data => {
      if (data.success) {
        setDeviceauthenticated(true)
        setshowImage(false)
        setAuthenticationError('None')
      } else if (data.error) {
        setAuthenticationError(data.error)
        setDeviceauthenticated(false)
        // setOverlayVisible(true)
      }
      console.log(data, "ddd")
    })
  }




  useEffect(() => {
    authenticate()
    console.log("opopop");
  }, [])




  return (
    <>
      {showImage && <Image style={{ width: '100%', height: '100%', borderRadius: 16 }} source={require("../../assets/images/splash.png")} />}
      {
        deviceauthenticated != undefined &&
        (deviceauthenticated ? 
          <InspectionsContextProvider>
            <VendorFormContextProvider>
              <UploadOfflineData />
              <AppNavigator />
            </VendorFormContextProvider>
          </InspectionsContextProvider>
       
          : authenticationError == "user_cancel" && <AlertBoX message={"For your security, you can onlu use this app when it's unlocked"} callback={authenticate} />
        )
      }
    </>
  )
}