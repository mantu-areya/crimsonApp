import React, { createContext, useEffect, useState } from "react";
import { updateSfVendorFormDetails } from "../../inspections/inspections.service";

export const VendorFormContext = createContext();

export const VendorFormContextProvider = ({ children }) => {
  const [vendorFormDetails, setVendorFormDetails] = useState({});

  const add = (dataset,inspData) => setVendorFormDetails({...vendorFormDetails,[inspData.Id] : dataset.length>0?dataset:"NA"})
  
  
  
  const update = (modifiedData,formType,inspId) => {
    Object.keys(vendorFormDetails).length>0 && vendorFormDetails[inspId].map(ele => {
      if (formType === "RM" ) {
        modifiedData.map(obj => {
          if (obj.UniqueKey__c === ele.UniqueKey__c) {
            ele['Room_Length__c']=obj.Room_Length__c;
            ele['Room_Width__c']=obj.Room_Width__c;
            ele['Room_Misc_SF__c']=obj.Room_Misc_SF__c;
            ele['Room_Total__c']=obj.Room_Total__c;
          }
          return obj
        });
      }
      if (formType === "OTHRFM" ) {
        modifiedData.forEach(obj => {
          if (obj.UniqueKey__c === ele.UniqueKey__c) {
            ele['Quantity__c']=obj.Quantity__c;
            ele['Rate__c']=obj.Rate__c;
            ele['Total__c']=obj.Total__c;
            ele['Scope_Notes__c']=obj.Scope_Notes__c;
            ele['U_M__c']=obj.U_M__c;

          }
          return obj
        });
      }
      return ele
    })
    return
  };

  const remove = (dataset) => {
    setVendorFormDetails([]);
  };

  const updateToSF = (inspId)=>{
    vendorFormDetails[inspId] && updateSfVendorFormDetails(vendorFormDetails[inspId])
  }
  
  return (
    <VendorFormContext.Provider
      value={{
        vendorFormDetails,
        addToVfContex: add,
        removeDataset: remove,
        updateVfContect:update,
        updateToSf : updateToSF,
      }}
    >
      {/* {console.log(vendorFormDetails['a028C00000MigX6QAJ'],"rndr")} */}
      {children}
    </VendorFormContext.Provider>
  );
};
