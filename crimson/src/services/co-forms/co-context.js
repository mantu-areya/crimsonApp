import React from 'react';
import { getCoForms } from './co-api';


const CoFormContext = React.createContext();

const CoFormContextProvider = ({ children }) => {
    const [allCo1Forms, setAllCo1Forms] = React.useState([]);
    const [allCo2Forms, setAllCo2Forms] = React.useState([]);
    const [allCo3Forms, setAllCo3Forms] = React.useState([]);


    const getAllCo1Forms = async () => {
        try {
            const res = await getCoForms();
            setAllCo1Forms(res.lstCOForms[0].lstCOFormsData);
        } catch (error) {
            console.log("CO ERROR", error);
        }
    }

    const getAllCoForms = async () => {
        try {
            const res = await getCoForms();
            setAllCo1Forms(res.lstCOForms[0].lstCOFormsData);
            setAllCo2Forms(res.lstCOForms[1].lstCOFormsData);
            setAllCo3Forms(res.lstCOForms[2].lstCOFormsData);
        } catch (error) {
            console.log("Get CO ERROR", error);
        }
    }


    return (
        <CoFormContext.Provider value={{ allCo1Forms, getAllCoForms, allCo2Forms, allCo3Forms }}>
            {children}
        </CoFormContext.Provider>
    )
}


export {
    CoFormContext,
    CoFormContextProvider
}