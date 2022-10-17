import React from 'react'

const AuthContext = React.createContext();

const AuthContextProvider = ({children}) => {
  const [isAuth, setIsAuth] = React.useState(false);

  const handleLogin = () => {
    setIsAuth(true);
  }

  const handleLogOut = () => {
    setIsAuth(false);
  }

  return (
    <AuthContext.Provider value={{isAuth,handleLogin,handleLogOut}}>
        {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthContextProvider }