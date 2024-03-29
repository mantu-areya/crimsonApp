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

  const { addToVfContex, setAscynDataToApp, vendorFormDetails, deletedLineItems,setDeletedLineItems,setModifiedItemsinOffline,modifiedItemsinOffline } = useContext(VendorFormContext)
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

  useEffect(()=>{

  },[offlineUploadStart])

  useEffect(() => {
    addVfData()
    addOfflineModifiedRecordsToApp()
    addOfflineDeletedDvdsToAPp()
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
      inspections && await AsyncStorage.multiSet([['inspection', JSON.stringify(inspections)], ['vendorForm', JSON.stringify(data)],['userRole', userRole],['modifiedItemsinOffline',JSON.stringify(modifiedItemsinOffline)],['deletedLineItems',JSON.stringify({deletedLineItems:deletedLineItems})]]);
      deletedLineItems && deletedLineItems.length > 0&& await AsyncStorage.setItem('deletedLineItems',JSON.stringify({deletedLineItems:deletedLineItems}));
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
    return await AsyncStorage.getItem('modifiedItemsinOffline').then(data => {
      JSON.parse(data) !== null  && console.log(data,"cn2");
      JSON.parse(data) !== null && setModifiedItemsinOffline({...modifiedItemsinOffline, ...JSON.parse(data)})  && setOfflineUploadStart("END")
      // Object.keys(modifiedItemsinOffline).length > 0 && AsyncStorage.setItem('modifiedItemsinOffline',JSON.stringify({})) 
    });
  }
  const addOfflineDeletedDvdsToAPp = async() =>{
    return await AsyncStorage.getItem('deletedLineItems').then(data => {
      JSON.parse(data) !== null  && console.log(JSON.parse(data),"cn2");
      JSON.parse(data) !== null && setDeletedLineItems(JSON.parse(data).deletedLineItems)  && setOfflineUploadStart("END")
      // Object.keys(modifiedItemsinOffline).length > 0 && AsyncStorage.setItem('modifiedItemsinOffline',JSON.stringify({})) 
    });
  }
  
  const offlineDataToSalesForce = () =>{
    let keyString =  deletedLineItems.length>0 && deletedLineItems.join(',')
    keyString && deleteLineItem(keyString)
    .then(setDeletedLineItems([])&&setOfflineUploadStar("END"))
    .catch(error=>{
      setOfflineUploadStar("END")
    })
    let vFData = []
     Object.keys(modifiedItemsinOffline).length > 0 &&  Object.keys(modifiedItemsinOffline).map(ele => {
       return  modifiedItemsinOffline[ele] !="NA" && modifiedItemsinOffline[ele].map(obj=>{
         return vFData.push(obj)
       })
    })
    vFData.length>0 ? updateSfVendorFormDetails(vFData,"BulkDvt").then(
       setModifiedItemsinOffline({})&&setOfflineUploadStart("END")
    ).catch(error=>{
      setOfflineUploadStar("END")
    }):setOfflineUploadStart("END")
  }

  return <>
  </>
}
