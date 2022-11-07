import React, { useState, createContext, useEffect } from "react";
import * as firebase from "firebase";

import { loginRequest } from "./authentication.service";
import AsyncStorage from "@react-native-async-storage/async-storage"

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const onLogin = (email, password) => {
    loginRequest(email, password)
      .then((u) => {
        setUser(u);
        AsyncStorage.setItem('FbAuth', JSON.stringify(u)).then(data => {
          return setIsLoading(false);
          // console.log(data,"settingtk");
        })
          .catch(err => {
            console.log(err);
          })

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
    AsyncStorage.setItem('FbAuth', null).then(data => {
      return setIsLoading(false);
    })
      .catch(err => {
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
        onLogout
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
