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

  const { addToVfContex, setAscynDataToApp, vendorFormDetails, deletedLineItems,setModifiedItemsinOffline,modifiedItemsinOffline } = useContext(VendorFormContext)
  const { inspections,userRole } = useContext(InspectionsContext);

  useEffect(() => {
    if (AppState.currentState == 'background' || AppState.currentState == 'inactive') {
      addDataToAsync(vendorFormDetails);
    }
    NetInfo.addEventListener(networkState => {
      console.log("network connected:",networkState.isConnected);
      if( networkState.isConnected ){
        console.log(networkState.isConnected,"state");
        if (offlineUploadStart == "NS" || offlineUploadStart == "END"  ){
            setOfflineUploadStart("STRD")
            offlineDataToSalesForce()
        } 
      }
    });
  })

  useEffect(() => {
    addVfData()
    addOfflineModifiedRecordsToApp()
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
      inspections &&  await AsyncStorage.multiSet([['inspection', JSON.stringify(inspections)], ['vendorForm', JSON.stringify(data)],['userRole', userRole],['modifiedItemsinOffline',JSON.stringify(modifiedItemsinOffline)]]);
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

  const addOfflineModifiedRecordsToApp = async() =>{
    await AsyncStorage.getItem('modifiedItemsinOffline').then(data => {
      JSON.parse(data) !== null && setModifiedItemsinOffline(JSON.parse(data))
    });
  }

  const offlineDataToSalesForce = () =>{
    console.log("add offline data to sf");
    let keyString =  deletedLineItems.length>0 && deletedLineItems.join(',')
    keyString ? deleteLineItem(keyString).catch(error=>{
      setOfflineUploadStart("END")
    }):setOfflineUploadStart("END")
    let vFData = []
    Object.keys(modifiedItemsinOffline).length >0 && Object.keys(modifiedItemsinOffline).map(ele => {
       return  modifiedItemsinOffline[ele].map(obj=>{
         return vFData.push(obj)
       })
    })
    vFData.length>0 ? updateSfVendorFormDetails(vFData,"BulkDvt").then(data=>{
      setOfflineUploadStart("UPLD")
      setModifiedItemsinOffline({})
    }
    ).catch(error=>{
      console.log("eror in uploading bulk dvds");
      setOfflineUploadStart("END")
    }): setOfflineUploadStart("END")

  }

  return <>
  </>
}
