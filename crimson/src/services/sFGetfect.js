import  jsforce  from "jsforce";
// const accessConfig = require('../../accessConfig')


const {SF_LOGIN_URL, SF_LOGIN_USERNAME, SF_PASSWORD, SF_TOKEN} = process.env
export async function makeJSForceCalloutAndSaveInDB() {

const conn = new jsforce.Connection({
  loginUrl: SF_LOGIN_URL,
})
conn.login(SF_LOGIN_USERNAME,SF_PASSWORD+SF_TOKEN, async (err, userInfo)=>{
  if(err){
    console.log(err);
  }else{

  let records = await conn.sobject("inspection__c")
  .select('*')
  .execute(async function(err, records) {
    if(err){
      console.log(err);
    }else{
      return records
    }
  });
  return records
  }
})
}

//  async function makeJSForceCalloutAndgetOrgData(req, res, next) {
//   const orgName = req.params.orgName;
//   const creds = accessConfig[orgName].SF_LOGIN_URL

//   const conn = new jsforce.Connection({
//     loginUrl: accessConfig[orgName].SF_LOGIN_URL
//   })

//   console.log(accessConfig[orgName].SF_LOGIN_USERNAME,accessConfig[orgName].SF_PASSWORD+accessConfig[orgName].SF_TOKEN);
//   conn.login(accessConfig[orgName].SF_LOGIN_USERNAME,accessConfig[orgName].SF_PASSWORD+accessConfig[orgName].SF_TOKEN, async (err, userInfo)=>{
//     if(err){
//       console.log(err);
//     }else{
  
//     let records = await conn.sobject("Contact")
//     .select('*')
//     .execute(async function(err, records) {
//       if(err){
//         console.log(err);
//       }else{
//         return records
//       }
//     });
//     res.send(records);
//     }
//   })
//   }
//  module.exports = {makeJSForceCalloutAndSaveInDB}