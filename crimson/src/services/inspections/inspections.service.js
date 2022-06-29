import { apiPost, apiPut, apiGet } from '../api/api';
var qs = require('qs');
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getToken = (username, password, apiKeyAuthInfo) => {
  var qs = require('qs');
  var data = qs.stringify({
    'grant_type': 'password',
    'client_id': '3MVG9S6qnsIUe5wCpVvuUrA_3HWCcmCNiTsimddyoHUtYNepSZ47B85lSvFdBZkXJd6fmdvpTRbpgNeiELukB',
    'client_secret': '99178E587F5BFD5AB0CEC5091E38823E9D2F529FC942DF34FE161A58DD3ED482',
    'username': 'yogeeswaran.saravanan@areya.tech.uat',
    'password': 'spring1234w3VrHbBDARdBzUiaypbNXZRd'
  });
  return apiPost('https://test.salesforce.com/services/oauth2/token', data
  )
    .then(response => {
      AsyncStorage.setItem('Token', response.data.access_token);
      return response.data.access_token;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
}


let getStoredToken = () => {
  return AsyncStorage.getItem('Token').then(
    (value) => {
      return value
    }
  ).catch(err => {
    console.log("error in getting Token", err);
  })
}

export const getInspectionsData = async () => {

  const token = await getToken();
  return apiGet(
    `https://hudsonhomesmgmt--uat.my.salesforce.com/services/data/v54.0/query/?q=SELECT+FIELDS(ALL)+from+inspection__c+where+Quip_Template_Version__c='v1.1'+and+Inspection_Stage__c!='Ordered'+LIMIT 40`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    },
  )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });

}

export const getPendingInspections = async () => {

  const token = await getToken();
  return apiGet(
    `https://hudsonhomesmgmt--uat.my.salesforce.com/services/data/v54.0/query/?q=SELECT+FIELDS(ALL)+from+inspection__c+where+Quip_Template_Version__c='v1.1'+and+Inspection_Stage__c!='Ordered'+LIMIT 3`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    },
  )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });

}

export const getVendorFormDetails = async (inspId) => {
  const token = await getToken();
  console.log("start");
  return apiGet(
    `https://hudsonhomesmgmt--uat.my.salesforce.com/services/data/v54.0/query/?q=SELECT+FIELDS(ALL)+from+Dynamic_Vendor_Template__c+where+Lookup_To_Parent__c='${inspId}'+LIMIT 200`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    },
  )
    .then(response => {
      console.log("end");
      return response.data;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });

}
