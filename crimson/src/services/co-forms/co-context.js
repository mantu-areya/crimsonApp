import React from 'react';
import { addANewCoLineItem, getCoForms, updateLineItem } from './co-api';


const CoFormContext = React.createContext();

const CoFormContextProvider = ({ children }) => {
    const [isDataLoading, setIsDataLoading] = React.useState(false);
    // * Create one State for All CO Forms
    const [coForms, setCoForms] = React.useState([]);
    const [initRehabId,setInitRehabId] = React.useState();



    const getAllCoForms = async (inspId) => {
        try {
            setIsDataLoading(true);
            const res = await getCoForms(inspId);
            setCoForms(res.lstCOForms)
            setInitRehabId(res.Initial_Rehab_ID)
        } catch (error) {
            console.log("Get CO ERROR", error);
        } finally {
            setIsDataLoading(false)
        }
    }

    // insp id

    const deleteALineItem = async (inspId) => {
        try {

        } catch (error) {
            console.log("DELETE CO ERROR", error);
        }
    }

    const updateCoFormContext = async (modifiedData, order) => {
        Object.keys(coForms).length > 0 && coForms[order] && coForms[order].lstCOFormsData.map(ele => {
            modifiedData.forEach(obj => {
                if (obj.UniqueKey === ele.UniqueKey) {
                    ele['Quantity'] = obj.Quantity;
                    ele['Rate'] = obj.Rate;
                    ele['Total'] = obj.Total;
                    ele['Scope_Notes'] = obj.Scope_Notes;
                    ele['U_M'] = obj.U_M;
                    ele['Cost_Category'] = obj.Cost_Category;
                    ele['Approval_Status'] = obj.Approval_Status;
                    ele['Adj_Rate'] = obj.Adj_Rate;
                    ele['Adj_Quantity'] = obj.Adj_Quantity;
                    ele['Owner_Clarification'] = obj.Owner_Clarification;
                    ele['Approved_Amount'] = obj.Approved_Amount;
                }
                return obj
            });
            return ele
        })
        return
    }

    const updateCoLineItemToSf = async (modifiedData) => {
        try {

            const res = await updateLineItem(modifiedData);
            console.log("UPDATE_RES",res);

        } catch (error) {
            console.log("UPDATED to SF CO", error.response.error);
        }
    }

    // Lookup
    // Contract Type
    // Unique Key
    // OTHER DATA FIELDS
    const addNewLineItem = async (newItem) => {
        try {

            const res = await addANewCoLineItem(newItem);
            console.log("ADDED",res.data);

        } catch (error) {
            console.log("Add CO ITEM ERROR", error);
        }
    }

    return (
        <CoFormContext.Provider value={{addNewLineItem, initRehabId,coForms, getAllCoForms, isDataLoading, updateCoFormContext,updateCoLineItemToSf }}>
            {children}
        </CoFormContext.Provider>
    )
}


export {
    CoFormContext,
    CoFormContextProvider
}