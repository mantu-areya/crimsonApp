import React, { useEffect, useState, useContext, Component, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { FlatList, View, Image, ScrollView, ImageBackground, AppState } from 'react-native';
import { InspectionsContext } from "../services/inspections/inspections.contex"
import { VendorFormContext } from "../services/context/VendorForm/vendorForm.contex"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { updateSfVendorFormDetails, deleteLineItem } from "../services/inspections/inspections.service"

export const UploadOfflineData = () => {

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [netStateChange, setNetStateChange] = useState('');
  const [offlineUploadStart, setOfflineUploadStart] = useState("NS")

  const { addToVfContex, setAscynDataToApp, vendorFormDetails, deletedLineItems } = useContext(VendorFormContext)
  const { inspections,userRole } = useContext(InspectionsContext);

  useEffect(() => {
    if (AppState.currentState == 'background' || AppState.currentState == 'inactive') {
      addDataToAsync(vendorFormDetails);
    }
    NetInfo.addEventListener(networkState => {
      console.log(networkState.isConnected);
      if(networkState.isConnected){
        if (offlineUploadStart == "NS" || offlineUploadStart == "END"  ){
            setOfflineUploadStart("STRD")
            offlineDataToSalesForce()
        } 
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
      inspections &&  await AsyncStorage.multiSet([['inspection', JSON.stringify(inspections)], ['vendorForm', JSON.stringify(data)],['userRole', userRole]]);
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
    let keyString =  deletedLineItems.length>0 && deletedLineItems.join(',')
    keyString && deleteLineItem(keyString).catch(error=>{
      setOfflineUploadStar("END")
    })
    let vFData = []
     Object.keys(vendorFormDetails).length > 0 &&  Object.keys(vendorFormDetails).map(ele => {
       return  vendorFormDetails[ele] !="NA" && vendorFormDetails[ele].map(obj=>{
         return vFData.push(obj)
       })
    })
    vFData.length>0 && updateSfVendorFormDetails(vFData,"BulkDvt").then(
      setOfflineUploadStart("UPLD")
    ).catch(error=>{
      setOfflineUploadStar("END")
    })
  }

  return <>
  </>
}
