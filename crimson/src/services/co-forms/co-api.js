import { apiPost, apiPut, apiGet, apiPatch, apiDelete } from '../api/api';
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

const deleteLineItem = async (id) => {
    const token = await getStoredToken();
    const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/COFORMS/${id}`;

    return apiDelete(
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

const submitForApproval = async (data) => {
    const token = await getStoredToken();
    const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/COFORMS/UpdateFormStage`;

    return apiPost(
        url,
        data,
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


const uploadCOLineItemImages = async (data, recordId) => {
    const token = await getStoredToken();
    console.log("uploading CO Line item image");
    const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/COFORMS/UploadImage?recordId=${recordId}`;
    return apiPost(
        url,
        data,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        },
    )
        .then(response => {
            console.log("CO IMG UPLOAD", response.data);
            return response.data
        })
        .catch(err => {
            console.log("CO IMG UPLOAD", err);
        });

}


const getCoLineItemImage = async (lineItemId) => {
    const token = await getStoredToken();
    console.log("get CO Line item image");
    const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/COFORMS/${lineItemId}`;
    return apiGet(
        url,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        },
    )
        .then(response => {
            console.log("CO GET IMG");
            return response.data
        })
        .catch(err => {
            console.log("CO GET IMG ERR ", err);
        });
}

export {
    getCoForms,
    updateLineItem,
    addANewCoLineItem,
    submitForApproval,
    deleteLineItem,
    uploadCOLineItemImages,
    getCoLineItemImage
}
