import React, { useEffect, useState, useContext, Component, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { FlatList, View, Image, ScrollView, ImageBackground, AppState } from 'react-native';
import { InspectionsContext } from "../services/inspections/inspections.contex"
import { VendorFormContext } from "../services/context/VendorForm/vendorForm.contex"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { updateSfVendorFormDetails } from "../services/inspections/inspections.service"

export const UploadOfflineData = () => {

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const { addToVfContex, setAscynDataToApp, vendorFormDetails } = useContext(VendorFormContext)
  const { inspections } = useContext(InspectionsContext);

  useEffect(() => {
    if (AppState.currentState == 'background' || AppState.currentState == 'inactive') {
      console.log("ffff");
      addDataToAsync(vendorFormDetails);
    }
    NetInfo.addEventListener(networkState => {
      console.log(networkState.isConnected);
      if(networkState.isConnected){
        offlineDataToSalesForce(vendorFormDetails)
      }
    });
  })

  useEffect(() => {
    addVfData()
    AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
  }, [])

  const addDataToAsync = async (data) => {
    try {
      inspections && await AsyncStorage.multiSet([['inspection', JSON.stringify(inspections)], ['vendorForm', JSON.stringify(data)]]);
    }
    catch (err) {
      console.log(err);

    }
  }

  const addVfData = async () => {
    await AsyncStorage.getItem('vendorForm').then(data => {
      JSON.parse(data) !== null && addToVfContex(JSON.parse(data))
    });
  }

  const offlineDataToSalesForce = () =>{
    let vFData = []
     Object.keys(vendorFormDetails).length > 0 &&  Object.keys(vendorFormDetails).map(ele => {
       return vendorFormDetails[ele].map(obj=>{
         return vFData.push(obj)
       })
    })
    vFData.length>0 && updateSfVendorFormDetails(vFData)
  }

  return <>
  </>
}