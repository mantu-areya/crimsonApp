import React, {useContext,useEffect} from "react";

import { VendorFormsPage } from "../components/VendorFormsPage"
import { VendorFormContext }from "../../../services/context/VendorForm/vendorForm.contex"
import { getVendorFormDetails } from "../../../services/inspections/inspections.service"
import NetInfo from "@react-native-community/netinfo";


export const InspectionDetailScreen = ({ route,navigation }) => {
  const { inspectionData } = route.params;
  const { vendorFormDetails, addToVfContex } = useContext(VendorFormContext);
  const setVendorFormData = async() => getVendorFormDetails(inspectionData.Id)
  .then(data => addToVfContex(data,inspectionData));

  useEffect(() => {
    NetInfo.fetch().then(networkState => {
      if(networkState.isConnected){
        setVendorFormData();
      }
      return
    })
  }, []);
  

  return (
    <>
      <VendorFormsPage inspectionData={inspectionData} navigation={navigation}/>
    </>
  )

}