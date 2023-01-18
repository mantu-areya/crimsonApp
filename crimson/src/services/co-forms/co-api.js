import { apiPost, apiPut, apiGet, apiPatch } from '../api/api';
var qs = require('qs');
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { getStoredToken } from "../inspections/inspections.service"


const getCoForms = async () => {

    const token = await getStoredToken();

    const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/COFORMS/a027f000004jMcIAAU`;

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


export {
    getCoForms
}