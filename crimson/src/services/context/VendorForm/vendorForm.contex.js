import React, { createContext, useState } from "react";

export const VendorFormContext = createContext();

export const VendorFormContextProvider = ({ children }) => {
  const [vendorFormDetails, setVendorFormDetails] = useState([]);

  const add = (dataset) => {
    console.log(dataset);
    setVendorFormDetails(dataset)
    // setFavourites([...favourites, dataset]);
  };


  const update = (modifiedData) => {

  };

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
      {children}
    </VendorFormContext.Provider>
  );
};
