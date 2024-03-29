import { apiPost, apiPut, apiGet, apiPatch } from '../api/api';
var qs = require('qs');
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

//imports for mock Data
// import { mockedVendorFormDetails } from "../../mocks/vendorFormDetails";

// function to get AccessToken remove after final App dev
// export const getToken = (username, password, apiKeyAuthInfo) => {
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



export let setToken = async () => {

  return AsyncStorage.getItem('userData').then(
    (value) => {
      let LocalToken = JSON.parse(value)
      return LocalToken && AsyncStorage.removeItem('Token').then(datq => {
        AsyncStorage.setItem('Token', LocalToken.access_token).then(data => {
          return
          // console.log(data,"settingtk");
        })
          .catch(err => {
            console.log(err);
          })
      }
      ).catch(err => {
        console.log(err);
      })
    }
  ).catch(err => {
    console.log("error in getting Token", err);
  })
}




export const refreshOrgToken = (userName) =>{
  return NetInfo.fetch().then(networkState => {
    // console.log("Is connected? - in settoken", networkState.isConnected);
    if (networkState.isConnected) {
      return AsyncStorage.getItem('SfAdminToken').then(
        (value) => {
          let adminToken = JSON.parse(value)
          return userName &&  apiGet(
            `https://areyatechnology7-dev-ed.my.salesforce.com/services/apexrest/AuthCrimson/${userName}`,
            {
              headers: {
                'Authorization': `Bearer ${adminToken && adminToken.replace(/"/g, "")}`,
              }
            }
          )
            .then(response => {
              return response.data && AsyncStorage.removeItem('userData').then(data => {
                return AsyncStorage.setItem('userData',JSON.stringify( response.data.userdata)).then(data => {
                  // console.log("updated new Org Token to local");
                  return
                })
                  .catch(err => {
                    console.log(err);
                  })
              }
              ).catch(err => {
                console.log(err);
              })
            })
            .catch(err => {
              console.error(JSON.stringify(err.request));
              // throw err;
            });
        }
      ).catch(err => {
        console.log("error in getting Token", err);
      })
    }
  })
}

export const setTokenoninterval = (userName) => setInterval(() => {
  refreshOrgToken(userName)
}, 18000000);



export const getStoredToken = () => {
  return AsyncStorage.getItem('Token').then(
    (value) => {
      return value
    }
  ).catch(err => {
    console.log("error in getting Token", err);
  })
}

export const getInspectionsData = async (userEmail) => {

  const token = await getStoredToken();
  console.log(userEmail, "email");
  return apiGet(
    `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/crimson/${userEmail}`,
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

export const getPendingInspections = async () => {

  const token = await getStoredToken();
  console.log(token && token);
  return apiGet(
    `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/data/v54.0/query/?q=SELECT+FIELDS(ALL)+from+inspection__c+where+Quip_Template_Version__c='v1.1'+and+Inspection_Stage__c!='Ordered'+LIMIT 3`,
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
  console.log("start", "get VFDetails");
  return apiGet(
    `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/crimson/${inspId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    },
  )
    .then(response => response.data)
    .catch(err => {
      console.log(err);
      console.error(JSON.stringify(err.request));
      // throw err;
    });

  //using mock Data
  // return mockedVendorFormDetails
}

export const updateSfVendorFormDetails = async (data, inspId, submitStatus = false, role = "Contractor") => {
  const token = await getStoredToken();
  console.log(inspId);
  // console.log("SUBMIT DTATA", data);
  console.log("start", "upload");

  // console.log("Upload Data",data);

  // data.map(ele=>{
  //  ele.Sub_Category=="Garage" && console.log(ele);
  // })
  return apiPost(
    `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/crimson?InspectionId=${inspId}&Submit=${submitStatus}&Role=${role}`,
    data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    },
  )
    .then(response => {
      console.log("Upload :", response.data.Status);
      return submitStatus ? response.data.Status : response.data["DynamicVendorTemplates"].DynamicVendorTemplate
    })
    .catch(err => {
      console.error("Upload :", err.message);
      console.error(JSON.stringify(err.request));

      // throw err;
    });
}


export const uploadSignImage = async (data, inspId) => {
  const token = await getStoredToken();
  console.log("uploading Sign Image");
  console.log(data.parent_record_id > "1.txt");
  console.log(data.parent_record_id);
  return apiPut(
    `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/crimson/insertImages?recordId=${inspId}`,
    data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    },
  )
    .then(response => {
      // console.log(response.data)
      console.log("IMG UPLOAD", response.data);
      return response.data
    })
    .catch(err => {
      console.error(JSON.stringify(err.request));
      console.log("IMG UPLOAD", err);
      // throw err;
    });
}

export const deleteLineItem = async (dvdId) => {
  const token = await getStoredToken();
  console.log("deleting Line Item");
  let data = {}
  return apiPatch(
    `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/crimson/deleteItems?recordId=${dvdId}`,
    data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    },
  )
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error(JSON.stringify(err.request));
      // throw err;
    });
}



export const getInspectionsChat = async (recordId) => {

  const token = await getStoredToken();

  const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/data/v50.0/chatter/feeds/record/${recordId}/feed-elements`;

  return apiGet(
    url,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    },
  )
    .then(response => {
      return response.data.elements
    })
    .catch(err => {
      console.error("GETTING CHAT ERR", err);
    });

}


export const postInspectionsChat = async (recordId, message) => {

  const token = await getStoredToken();

  const url = "https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/data/v50.0/chatter/feed-elements";

  return apiPost(
    url,
    {
      "feedElementType": "FeedItem",
      "subjectId": recordId,
      "body": {
        "messageSegments": [
          {
            "type": "Text",
            "text": message
          }
        ]
      }
    }
    ,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    },
  )
    .then(response => {
      return response
    })
    .catch(err => {
      console.error(err);
    });

}


export const postSendFileEmail = async (inspId, email) => {

  const token = await getStoredToken();

  const url = `https://hudsonhomesmgmt--uat.sandbox.my.salesforce.com/services/apexrest/Download/WorkAuth`;

  console.log("EMAIL: " , email);

  return apiPost(
    url,
    {
      "EmailId":email, // ! CONFIRM FALLBACK FOR UNDEFINED EMAILS
      "RecordId": inspId
    }
    ,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": 'application/json'
      }
    },
  )
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.error(err);
    });

}