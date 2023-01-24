import { apiPost, apiPut, apiGet, apiPatch } from '../api/api';
var qs = require('qs');
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { getStoredToken } from "../inspections/inspections.service"


const getCoForms = async (inspId) => {

    const token = await getStoredToken();

    const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/COFORMS/${inspId}`;

    return apiGet(
        url,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        },
    )
        .then(response => {
            return response.data;
        })

}


const updateLineItem = async (item) => {
    const token = await getStoredToken();
    const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/COFORMS/Add`;

    return apiPut(
        url,
        item,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        },
    )
        .then(response => {
            return response.data;
        })

}

const addANewCoLineItem = async (item) => {
    const token = await getStoredToken();
    const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/COFORMS/Add`;

    return apiPut(
        url,
        item,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        },
    )
        .then(response => {
            return response.data;
        })
}


export {
    getCoForms,
    updateLineItem,
    addANewCoLineItem
}
