import { apiPost, apiPut, apiGet, apiPatch } from '../api';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import * as firebase from "firebase";

export const getFbToken = () => {
  const reference = firebase.database().ref('user/token')
  const fBtoken = new Promise((resolve, reject) => {
    reference.on('value', snapshot => {
      if (snapshot) {
        resolve(snapshot.val())
      } else {
        reject("errorfromFB");
      }
    })
  });
  return fBtoken
}

export const sendOtp = async (data) => {
  getFbToken().then(token => {
    return apiPost(
      `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson?OTPStatus=send`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      },
    )
      .then(response => {
        console.log("Upload :", response.data);
        return response.data
      })
      .catch(err => {
        console.error("Upload :", err.message);
        console.error(JSON.stringify(err.request));
      });
  })

}

export const verifyOtp = async (data) => {

  return getFbToken().then(token => {
    return apiPost(
      `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson?OTPStatus=validate`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      },
    )
  })
}
