import React, { useState, createContext, useEffect, useContext } from "react";
import { getInspectionsData, getPendingInspections, setToken } from "./inspections.service";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage"

// imports for mocking results
// import { mockedinspections } from "../../mocks/inspections";


export const InspectionsContext = createContext();

export const InspectionsContextProvider = ({ children }) => {

  const [inspections, setInspections] = useState(null);
  const [vendorFormData, setVendorFormData] = useState(null);
  const [pendingInspection, setpendingInspection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stateChnage, setStaeChange] = useState(true);
  const [isOnline, setIsOnline] = useState(null)
  const [userRole,setUserRole]= useState(null)


  const retrieveInspections = () => {
    setIsLoading(true);
    getInspectionsData()
      .then(results => {
        setIsLoading(false);
        setUserRole(results["Role"])
        setInspections(results["Inspections"].Inspection)

      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
        console.log(err);
      });

    // mocking local inspection data
    // setInspections(mockedinspections)


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

    // mocking local inspection data
    // return inspections;

  };

  useEffect(() => {
    NetInfo.fetch().then(networkState => {
      // console.log("Is connected? - in contex", networkState.isConnected);
      if (networkState.isConnected) {
        console.log("vsvsv");
        setIsOnline(networkState.isConnected)
        setToken().then(() => {
          retrieveInspections();
          retrievePendingInspections()
          return
        }
        )
      } else {
        setIsOnline(networkState.isConnected)
        try {
          AsyncStorage.getItem('inspection').then(data => {
            setIsLoading(false);
            setInspections(JSON.parse(data))
          });
        }
        catch (err) {
          console.log(err);

        }
      }
      return
    });
  }, [stateChnage])

  const changeState = () => setStaeChange(!stateChnage)

  const reloadInspectionContext = ()=>{
      NetInfo.fetch().then(networkState => {
        if (networkState.isConnected) {
          setToken().then(() => {
            retrieveInspections();
            return
          }
          )
        } 
        return
      });
  }

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
        reloadInspectionContext,
        userRole
      }}
    >
      {children}
    </InspectionsContext.Provider>
  );


}
