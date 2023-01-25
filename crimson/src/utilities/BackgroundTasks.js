import React, { useEffect, useState, useContext, Component, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { FlatList, View, Image, ScrollView, ImageBackground, AppState } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { updateSfVendorFormDetails, deleteLineItem } from "../services/inspections/inspections.service"

export const BackgroundTasks = () => {

  const appState = useRef(AppState.currentState);
  const [offlineUploadStart, setOfflineUploadStart] = useState("NS")


  useEffect(() => {
    if (AppState.currentState == 'background' || AppState.currentState == 'inactive') {
      console.log("backgrounded");
      // addDataToAsync(vendorFormDetails);
      NetInfo.addEventListener(networkState => {
        console.log("background network connected:", networkState.isConnected);
        if (networkState.isConnected) {
          console.log(networkState.isConnected, "state");
          if (offlineUploadStart == "NS" || offlineUploadStart == "END") {
            setOfflineUploadStart("STRD")
            offlineDataToSalesForce()
          }
        }
      });
    }


  })


  const offlineDataToSalesForce = async () => {
    // let keyString =  deletedLineItems.length>0 && deletedLineItems.join(',')
    // keyString && deleteLineItem(keyString).catch(error=>{
    //   setOfflineUploadStart("END")
    // })
    let vFData = []

    return await AsyncStorage.getItem('modifiedItemsinOffline').then(data => {
      let modifiedItemsinOffline = JSON.parse(data)
      modifiedItemsinOffline !== null && Object.keys(modifiedItemsinOffline).length > 0 && Object.keys(modifiedItemsinOffline).map(ele => {
        return modifiedItemsinOffline[ele].map(obj => {
          return vFData.push(obj)
        })
      })
      vFData.length > 0 ? updateSfVendorFormDetails(vFData, "BulkDvt").then(async (data) => {
        console.log("offlineDataUpdt");
        setOfflineUploadStart("UPLD")
        return await AsyncStorage.setItem('modifiedItemsinOffline',JSON.stringify({})).catch(err=>{
          console.log("error in setting empty json");
        })
        return
      }
      ).catch(error => {
        console.log("eror in uploading bulk dvds");
        setOfflineUploadStart("END")
      }) : setOfflineUploadStart("END")

    }).catch(error => (
      console.log("error in async of modifiedItemOffline", eror)
    ))




  }

  return <>
  </>
}
