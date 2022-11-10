import React, { useState, createContext, useEffect } from "react";
import * as firebase from "firebase";

import { loginRequest } from "./authentication.service";
import AsyncStorage from "@react-native-async-storage/async-storage"

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [fBLoginData, setFbLoginData] = useState(null)

  const onLogin = (email, password) => {
    loginRequest(email, password)
      .then((u) => {
        setFbLoginData(u);
        setError(null)

      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const onAppLoad = () => {
    setIsLoading(true);
    AsyncStorage.getItem('FbAuth').then(data => {
      setUser(JSON.parse(data));
      setIsLoading(false);
    })
  }

  const onLogout = () => {
    setUser(null);
    AsyncStorage.removeItem('FbAuth').then()
      .catch(err => {
        console.log(err);
      })
  }

  const onOtpVerified = (orgToken) => {
    const token = orgToken
    token && setUser(fBLoginData && fBLoginData) 
    AsyncStorage.setItem('FbAuth', JSON.stringify(fBLoginData)).then(data => {
        return setIsLoading(false);
        // console.log(data,"settingtk");
      })
        .catch(err => {
          console.log(err);
        })
    return AsyncStorage.removeItem('Token').then(
      AsyncStorage.setItem('Token', token).then()
        .catch(err => {
          console.log(err);
        })
    ).catch(err => {
      console.log(err);
    })
  }
  useEffect(() => {
    onAppLoad()
  }, [])

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        onLogin,
        onAppLoad,
        onLogout,
        fBLoginData,
        onOtpVerified
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
