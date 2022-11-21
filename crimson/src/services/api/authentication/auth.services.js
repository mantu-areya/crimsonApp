// import { apiPost, apiPut, apiGet, apiPatch } from '../api';
// import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
// import * as firebase from "firebase";

// export const getFbToken = () => {
//   var qs = require('qs');
//   var data = qs.stringify({
//     'grant_type': 'password',
//     'client_id': '3MVG9wt4IL4O5wvI4PySmNNrBLXwBZingrtj_Jy5Nc_X3UKaSqftCpTXb70a46VTpE7rBcj.zm_dLqm0Vuwm5',
//     'client_secret': 'A552CB01650BB01A983E836E1644F3D2707CEB46B3D2CAB8E0C395E84BE37835',
//     'username': 'bhupendra.singh@areya.tech.dev',
//     'password': 'Areya@2001gMmBKQzT8yObHlhHxD680LmQJ'
//   });
//   return apiPost('https://test.salesforce.com/services/oauth2/token', data
//   )
//     .then(response => {
//       return response.data.access_token;
//     })
//     .catch(err => {
//       console.error(err);
//       // throw err;
//     });

// }

// export const verifyOtp = async (data) => {

//   return getFbToken().then(token => {
//     return apiPost(
//       `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson?OTPStatus=validate`,
//       data,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       },
//     )
//   })
// }

// export let setToken = async () => {

//   const token = await getToken();
//   // const token = await getStoredToken();
//   return AsyncStorage.removeItem('Token').then(
//     AsyncStorage.setItem('Token', token).then(data => {
//       return
//       // console.log(data,"settingtk");
//     })
//       .catch(err => {
//         console.log(err);
//       })
//   ).catch(err => {
//     console.log(err);
//   })
// }

// send Otp
// export const sendOtp = async (data) => {
//   getFbToken().then(token => {
//     return apiPost(
//       `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson?OTPStatus=send`,
//       data,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       },
//     )
//       .then(response => {
//         console.log("Upload :", response.data);
//         return response.data
//       })
//       .catch(err => {
//         console.error("Upload :", err.message);
//         console.error(JSON.stringify(err.request));
//       });
//   })

// }


// verify the otp remove once ots removed 
// export const verifyOtp = async (data) => {

//   return getFbToken().then(token => {
//     return apiPost(
//       `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson?OTPStatus=validate`,
//       data,
//       {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       },
//     )
//   })
// }
