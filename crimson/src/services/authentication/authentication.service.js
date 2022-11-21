// import * as firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { apiPost, apiPut, apiGet, apiPatch } from '../api/api';


export const setOrgToken = () => {
  var qs = require('qs');
  var data = qs.stringify({
    'grant_type': 'password',
    'client_id': '3MVG9wt4IL4O5wvI4PySmNNrBLXwBZingrtj_Jy5Nc_X3UKaSqftCpTXb70a46VTpE7rBcj.zm_dLqm0Vuwm5',
    'client_secret': 'A552CB01650BB01A983E836E1644F3D2707CEB46B3D2CAB8E0C395E84BE37835',
    'username': 'crimson.mobile@areya.tech',
    'password': 'Areya@2001xnNPh415vKHd0MpqIfRK1oln'
  });
  console.log(data,"er");
  return data && apiPost('https://login.salesforce.com/services/oauth2/token?', data
  )
    .then(response => {
      AsyncStorage.setItem('SfAdminToken', JSON.stringify(response.data.access_token)).then(data => {
        return
        // console.log(data,"settingtk");
      })
    })
    .catch(err => {
      console.log("error in setOrgToken ",JSON.stringify(err.request));
      console.error(err);
      // throw err;
    });

}


const setTokenoninterval = () => setInterval(() => {
  return NetInfo.fetch().then(networkState => {
    // console.log("Is connected? - in settoken", networkState.isConnected);
    if (networkState.isConnected) {
      setOrgToken()
      return
    }
  })
}, 18000000);

setTokenoninterval();

let getStoredAuthToken = () => {
  return AsyncStorage.getItem('SfAdminToken').then(
    (value) => {
      return value
    }
  ).catch(err => {
    console.log("error in getting Token", err);
  })
}

// send Otp
export const sendOtp = async (data) => {
  const adminToken = await getStoredAuthToken();
      return apiPost(
      `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson?OTPStatus=send`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${adminToken && adminToken.replace(/"/g, "")}`,
        },
      },
    )
    .then(
      response=>{
        console.log(response.data);
       return  response.data.message
      }
    )
}


//Verify Otp

export const verifyOtp = async (data) => {
  const adminToken = await getStoredAuthToken();
    return apiPost(
      `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson?OTPStatus=validate`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${adminToken && adminToken.replace(/"/g, "")}`,
        },
      },
    )
}




// export const loginRequest = async (data) => {
  
//   const adminToken = await getStoredAuthToken();
//   console.log("runin",`Bearer ${adminToken && adminToken.replace('"','')}`);

//   return apiPost(
//     `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson`,
//     data,
//     {      
//       headers: {
//         'Authorization': `Bearer ${adminToken && adminToken.replace(/"/g, "")}`,
//       },
//     },
//   )
//     .then(response => {
//       return response.data.userdata
//     })
//     .catch(err => {
//       console.log(JSON.stringify(err), "error in connecting org");
//       console.error(err);
//       // throw err;
//     });

// }




// export const loginRequest = (email, password) =>
//   firebase.auth().signInWithEmailAndPassword(email, password);
