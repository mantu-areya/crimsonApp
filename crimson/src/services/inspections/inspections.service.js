import { apiPost, apiPut, apiGet } from '../api/api';
var qs = require('qs');
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";


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
      return response.data.access_token;
    })
    .catch(err => {
      console.error(err);
      // throw err;
    });
}



export let setToken = async () => {

  const token = await getToken();
  // const token = await getStoredToken();
  return AsyncStorage.removeItem('Token').then(
    AsyncStorage.setItem('Token', token).then(data => {
      return
      // console.log(data,"settingtk");
    })
      .catch(err => {
        console.log(err);
      })
  ).catch(err => {
    console.log(err);
  })
}

const setTokenoninterval = () => setInterval(() => {
  return NetInfo.fetch().then(networkState => {
    // console.log("Is connected? - in settoken", networkState.isConnected);
    if (networkState.isConnected) {
      setToken()
      return
    }
  })
}, 500000);

setTokenoninterval();

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

  const token = await getStoredToken();

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
      // throw err;
    });

}

export const getPendingInspections = async () => {

  const token = await getStoredToken();
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
      // throw err;
    });

}

export const getVendorFormDetails = async (inspId) => {
  const token = await getStoredToken();
  console.log("start");
  return apiGet(
    `https://hudsonhomesmgmt--uat.my.salesforce.com/services/apexrest/crimson/${inspId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    },
  )
    .then(response => response.data )
    .catch(err => {
      console.log(err);
      console.error(err);
      // throw err;
    });

}
