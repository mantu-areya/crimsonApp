import React from 'react';


const CoFormContext = React.createContext();

const CoFormContextProvider = ({children}) => {
    <CoFormContext.Provider value={{}}>
        {children}
    </CoFormContext.Provider>
}


export {
    CoFormContext,
    CoFormContextProvider
}