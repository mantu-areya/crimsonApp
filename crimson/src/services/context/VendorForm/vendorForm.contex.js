import React, { createContext, useState } from "react";

export const VendorFormContext = createContext();

export const VendorFormContextProvider = ({ children }) => {
  const [vendorFormDetails, setVendorFormDetails] = useState({});

  const add = (dataset,inspData) => setVendorFormDetails({...vendorFormDetails,[inspData.Id] : dataset})
  
  
  
  const update = (modifiedData) => {};

  const remove = (dataset) => {
    setVendorFormDetails([]);
  };
  
  return (
    <VendorFormContext.Provider
      value={{
        vendorFormDetails,
        addToVfContex: add,
        removeDataset: remove,
        updateVfContect:update,
      }}
    >
      {/* {console.log(vendorFormDetails['a028C00000MigX6QAJ'],"rndr")} */}
      {children}
    </VendorFormContext.Provider>
  );
};
