import React, { useState, createContext, useEffect, useContext } from "react";
import { getInspectionsData, getPendingInspections } from "./inspections.service";



export const InspectionsContext = createContext();

export const InspectionsContextProvider = ({ children }) =>{

  const [inspections, setInspections] = useState(null);
  const [vendorFormData,setVendorFormData] = useState(null);
const [pendingInspection, setpendingInspection] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const retrieveInspections = () =>{
  setIsLoading(true);
  getInspectionsData()
  .then(results=>{
    setIsLoading(false);
    setInspections(results)
  })
  .catch((err) => {
    setIsLoading(false);
    setError(err);
    console.log(err);
  });
};

const retrievePendingInspections = () =>{
  setIsLoading(true);
  getPendingInspections()
  .then(results=>{
    setIsLoading(false);
    setpendingInspection(results)
  })
  .catch((err) => {
    setIsLoading(false);
    setError(err);
    console.log(err);
  });
};

useEffect(()=>{
  retrieveInspections();
  retrievePendingInspections();
},[])
  


return (
  <InspectionsContext.Provider
    value={{
      isLoading,
      error,
      inspections,
      pendingInspection,
      setVendorFormData
        }}
  >
    {children}
  </InspectionsContext.Provider>
);


}
