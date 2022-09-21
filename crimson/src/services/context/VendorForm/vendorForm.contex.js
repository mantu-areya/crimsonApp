import React, { createContext, useEffect, useState, useContext } from "react";
import { updateSfVendorFormDetails } from "../../inspections/inspections.service";
import { InspectionsContext } from "../../inspections/inspections.contex"
import AsyncStorage  from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo";

export const VendorFormContext = createContext();
export const VendorFormContextProvider = ({ children }) => {
  const [vendorFormDetails, setVendorFormDetails] = useState({});
  const { inspections } = useContext(InspectionsContext);

  const add = (dataset, inspData) => inspData?setVendorFormDetails({ ...vendorFormDetails, [inspData.Id]: dataset.length > 0 ? dataset : "NA" })
  :setVendorFormDetails(dataset)
  

  const update = (modifiedData, formType, inspId) => {
    Object.keys(vendorFormDetails).length > 0 && vendorFormDetails[inspId]&&vendorFormDetails[inspId].map(ele => {
      if (formType === "RM") {
        modifiedData.map(obj => {
          if (obj.UniqueKey === ele.UniqueKey) {
            ele['Room_Length'] = obj.Room_Length;
            ele['Room_Width'] = obj.Room_Width;
            ele['Room_Misc_SF'] = obj.Room_Misc_SF;
            ele['Room_Total'] = obj.Room_Total;
          }
          return obj
        });
      }
      if (formType === "OTHRFM") {
        console.log("Testing OTHRFM");
        modifiedData.forEach(obj => {
          if (obj.UniqueKey === ele.UniqueKey) {
            ele['Quantity'] = obj.Quantity;
            ele['Rate'] = obj.Rate;
            ele['Total'] = obj.Total;
            ele['Scope_Notes'] = obj.Scope_Notes;
            ele['U_M'] = obj.U_M;

          }
          return obj
        });
      }
      return ele
    })
    return
  };

const setAscynDataToApp =async () =>{
  await AsyncStorage.getItem('vendorForm').then(data => {
    console.log(data,"d->A");
    JSON.parse(data)!==null && setVendorFormDetails(JSON.parse(data))
  });
}

useEffect(()=>{
// console.log("vendorFormDetailsChanges");
},[vendorFormDetails])

  const remove = (dataset) => {
    setVendorFormDetails([]);
  };

  const updateToSF = (inspId) => {
    NetInfo.fetch().then(networkState => {
    if(networkState.isConnected){
      vendorFormDetails[inspId] && updateSfVendorFormDetails(vendorFormDetails[inspId],inspId)
    }
  })
  }



  return (
    <VendorFormContext.Provider
      value={{
        vendorFormDetails,
        addToVfContex: add,
        removeDataset: remove,
        updateVfContect: update,
        updateToSf: updateToSF,
        setAscynDataToApp,
        
      }}
    >
      {/* {console.log(vendorFormDetails['a028C00000MigX6QAJ'],"rndr")} */}
      {children}
    </VendorFormContext.Provider>
  );
};
