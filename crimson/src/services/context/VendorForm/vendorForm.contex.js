import React, { createContext, useEffect, useState, useContext } from "react";
import { updateSfVendorFormDetails,uploadSignImage, getVendorFormDetails } from "../../inspections/inspections.service";
import { InspectionsContext } from "../../inspections/inspections.contex"
import AsyncStorage  from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo";

export const VendorFormContext = createContext();
export const VendorFormContextProvider = ({ children }) => {
  const [vendorFormDetails, setVendorFormDetails] = useState({});
  const [contextImages , setContextImages] = useState({});
  const add = (dataset, inspData) => inspData?setVendorFormDetails({ ...vendorFormDetails, [inspData.Id]: dataset.length > 0 ? dataset : "NA" })
  :setVendorFormDetails(dataset)

  const addImagesToContex = (inspId) =>{
    getVendorFormDetails(inspId)
    .then(data => setContextImages({...contextImages, [inspId]:data["Images"]}));
  }

  const addSignature = (inspId,img) => {
   //backup code for adding to the context 
  // let vfData = vendorFormDetails[inspId]
  // vfData && vfData.push({
  //   "images":{
  //     "file_name":"Contractor signature",
  //     "image_data": img,
  //     "parent_record_id":inspId,
  //     "image_type":"sign_item",
  //     "line_item_id":inspId,
  //   }
  // })
    let date = new Date().toLocaleDateString()
    let formatedDate = date.split('/')
  const data = [{
      "file_name":"Contractor_Signature_"+new Date().toISOString().slice(0, 10),
      "image_data": img,
      "parent_record_id":inspId,
      "image_type":"sign_item",
      "line_item_id":inspId,
    }]
    console.log(data.file_name);
  uploadSignImage(data,inspId).then(result=>{
    addImagesToContex(inspId)
    return result
  })

  // vfData.map(ele=>{
  //   if (ele.images){
  //     console.log(JSON.stringify(ele, null, 4)); 
  //     // console.log(ele);
  //   }
  // })

  // vfData.length > 0 && console.log(vfData,"ccc");
  // img && vfData && setVendorFormDetails({...vendorFormDetails,[inspId]: vfData.length > 0 ? vfData : "NA"})

}
  const addNewItem = (newData,inspId)=>{
    let newVfDataArray = vendorFormDetails[inspId]
    newVfDataArray.push(newData[0])
    setVendorFormDetails({ ...vendorFormDetails, [inspId]: newVfDataArray})
  }

  const update = (modifiedData, formType, inspId) => {
    Object.keys(vendorFormDetails).length > 0 && vendorFormDetails[inspId]&&vendorFormDetails[inspId].map(ele => {
      if (formType === "RM") {
        modifiedData.map(obj => {
          if (obj.UniqueKey === ele.UniqueKey) {
            ele['Room_Length'] = obj.Room_Length;
            ele['Room_Width'] = obj.Room_Width;
            ele['Room_Misc_SF'] = obj.Room_Misc_SF;
            ele['Room_Total'] = obj.Room_Total;
            ele['Sub_Category'] = obj.Sub_Category;
          }
          return obj
        });
      }
      if (formType === "OTHRFM") {
        // console.log("Testing OTHRFM");
        modifiedData.forEach(obj => {
          if (obj.UniqueKey === ele.UniqueKey) {
            ele['Quantity'] = obj.Quantity;
            ele['Rate'] = obj.Rate;
            ele['Total'] = obj.Total;
            ele['Scope_Notes'] = obj.Scope_Notes;
            ele['U_M'] = obj.U_M;
            ele['Matrix_Price'] = obj.Matrix_Price;

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
        addSignature:addSignature,
        addImagesToContex,
        contextImages,
        addNewItem
        
      }}
    >
      {children}
    </VendorFormContext.Provider>
  );
};
