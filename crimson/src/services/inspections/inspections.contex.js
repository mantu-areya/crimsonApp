import React, { useState, createContext, useEffect, useContext } from "react";
import { getInspectionsData, getPendingInspections, setToken } from "./inspections.service";
import NetInfo,{useNetInfo} from "@react-native-community/netinfo";



export const InspectionsContext = createContext();

export const InspectionsContextProvider = ({ children }) => {

  const [inspections, setInspections] = useState(null);
  const [vendorFormData, setVendorFormData] = useState(null);
  const [pendingInspection, setpendingInspection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stateChnage, setStaeChange] = useState(true);
  const [isOnline,setIsOnline] = useState(null)


  const retrieveInspections = () => {
    setIsLoading(true);
    getInspectionsData()
      .then(results => {
        setIsLoading(false);
        setInspections(results)
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
        console.log(err);
      });
  };

  const retrievePendingInspections = () => {
    setIsLoading(true);
    getPendingInspections()
      .then(results => {
        setIsLoading(false);
        setpendingInspection(results)
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
        console.log(err);
      });
  };



  

  // console.log( NetInfo.refresh().then(data=>console.log(data,"dd")));
  useEffect(() => {
      NetInfo.fetch().then(networkState => {
      // console.log("Is connected? - in contex", networkState.isConnected);
      if (networkState.isConnected) {
        setIsOnline(networkState.isConnected)
        setToken().then(()=>{
        retrieveInspections();
        retrievePendingInspections()
        return
        }
        )
      }else{
        setIsOnline(networkState.isConnected)
      }
      return
    });
  }, [stateChnage])

  const changeState = () => setStaeChange(!stateChnage)
  return (
    <InspectionsContext.Provider
      value={{
        isLoading,
        error,
        inspections,
        pendingInspection,
        setVendorFormData,
        isOnline,
        changeState,
      }}
    >
      {children}
    </InspectionsContext.Provider>
  );


}
