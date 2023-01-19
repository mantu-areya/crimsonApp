import React from 'react';
import { getCoForms } from './co-api';


const CoFormContext = React.createContext();

const CoFormContextProvider = ({ children }) => {
    const [isDataLoading, setIsDataLoading] = React.useState(false);
    const [allCo1Forms, setAllCo1Forms] = React.useState([]);
    const [allCo2Forms, setAllCo2Forms] = React.useState([]);
    const [allCo3Forms, setAllCo3Forms] = React.useState([]);


    const getAllCoForms = async (inspId) => {
        try {
            setIsDataLoading(true);
            const res = await getCoForms(inspId);
            console.log("got co data");
            setAllCo1Forms(res.lstCOForms[0].lstCOFormsData);
            setAllCo2Forms(res.lstCOForms[1].lstCOFormsData);
            setAllCo3Forms(res.lstCOForms[2].lstCOFormsData);
        } catch (error) {
            console.log("Get CO ERROR", error);
        }  finally {
            setIsDataLoading(false)
        }
    }


    return (
        <CoFormContext.Provider value={{ allCo1Forms, getAllCoForms, allCo2Forms, allCo3Forms,isDataLoading }}>
            {children}
        </CoFormContext.Provider>
    )
}


export {
    CoFormContext,
    CoFormContextProvider
}