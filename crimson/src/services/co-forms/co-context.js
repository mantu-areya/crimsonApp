import React from 'react';
import { getCoForms } from './co-form-apis';


const CoFormContext = React.createContext();

const CoFormContextProvider = ({ children }) => {
    const [allCo1Forms, setAllCo1Forms] = React.useState([]);


    const getAllCo1Forms = async () => {
        try {
            const res = await getCoForms();
            setAllCo1Forms(res.lstCOForms[0].lstCOFormsData);
        } catch (error) {
            console.log("CO ERROR", error);
        }
    }


    return (
        <CoFormContext.Provider value={{ allCo1Forms, getAllCo1Forms }}>
            {children}
        </CoFormContext.Provider>
    )
}


export {
    CoFormContext,
    CoFormContextProvider
}