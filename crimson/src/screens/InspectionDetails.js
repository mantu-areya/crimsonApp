import { ScrollView, Text, View, TextInput, Modal, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import CallNow from '../components/inspection-details/CallNow'
import Hero from '../components/inspection-details/Hero'
import CTA from '../components/inspection-details/CTA'
import { VendorFormContext } from '../services/context/VendorForm/vendorForm.contex'
import { getVendorFormDetails, updateSfVendorFormDetails } from '../services/inspections/inspections.service'
import NetInfo from "@react-native-community/netinfo";
import OtherForms from '../components/inspection-details/vendor-form/OtherForms'
import { SubmitReviewForm } from '../features/gcs/components/SubmitReviewForm'
import Overlay from 'react-native-modal-overlay'
import { InspectionsContext } from '../services/inspections/inspections.contex'
import { AuthenticationContext } from '../services/authentication/authentication.context'
import { Button, } from 'react-native-paper'
import Sign from '../features/gcs/components/workAuth/Sign.js';
import * as ImagePicker from "expo-image-picker";



const InspectionDetails = ({ route, navigation }) => {

  const [show, setShow] = React.useState(false);
  const [offSetY, setOffSetY] = React.useState(0);

  const { user } = React.useContext(AuthenticationContext);



  console.log("USER", user);

  React.useEffect(() => {
    if (offSetY < 200) {
      console.log("Hiding Call");
      setShow(true);
    } else {
      setShow(false)
    }
  }, [offSetY])


  const [isNotesCollapsed, setIsNotesCollapsed] = React.useState(false);
  const { inspectionData } = route.params;

  console.log("FLSLDL",inspectionData.Amount_Submitted_GC);
  const { vendorFormDetails, addToVfContex, addImagesToContex } = React.useContext(VendorFormContext);
  const { userRole } = React.useContext(InspectionsContext);
  const setVendorFormData = async () => getVendorFormDetails(inspectionData.Id)
    .then(data => addToVfContex(data["DynamicVendorTemplates"].DynamicVendorTemplate, inspectionData));

  React.useEffect(() => {
    NetInfo.fetch().then(networkState => {
      if (networkState.isConnected) {
        setVendorFormData();
        addImagesToContex(inspectionData.Id)
      }
      return
    })
  }, []);

  React.useEffect(() => {
    let stagesArray = ["Work Auth Form Completed", "Reviewer Form Completed", "Vendor Form Completed"]
    stagesArray.includes(inspectionData.Inspection_Form_Stage__c) && setreadonly(true)
  }, [inspectionData])


  const [readOnly, setreadonly] = React.useState(inspectionData.Inspection_Form_Stage__c === "Vendor Form Completed")
  console.log("Setting Form ReadOnly to", readOnly);


  const handleSubmit = () => {
    console.log("Submitting for", userRole);
    setIsSubmitModalOpen(true);
  }

  console.log({userRole});



  const handleSignature = () => {
    setShowSiganturesView(true);
  };
  const handleViewImages = () => {
    navigation.navigate("ImageGallery", { inspId: inspectionData.Id });
  }

  const [isSubmitted, setIsSubmitted] = React.useState(inspectionData?.doCreateWAF__c || false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);
  const [showSiganturesView, setShowSiganturesView] = React.useState(false);

  console.log("CURRENT INSPECTION", inspectionData.Id);


  let currentRecord = vendorFormDetails[inspectionData.Id];

  function getFormTotal(formCategory, formatted = true) {
    let total = 0;
    if (formCategory === "all") {
      currentRecord && currentRecord.forEach(ele => {
        if (ele.Approval_Status === "Approved" || ele.Approval_Status === "Approved as Noted") {
          total += ele.Total;
        }
      });
      return formatted ? total.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : total;
    }
    currentRecord && currentRecord.forEach(ele => {
      if (ele.Category === formCategory && (ele.Approval_Status === "Approved" || ele.Approval_Status === "Approved as Noted")) {
        total += ele.Total;
      }
    });
    return formatted ? total.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : total;
  }

  let sectionTotals = {
    grs: getFormTotal("General Rental Operations Scope"),
    pools: getFormTotal("Pools"),
    interior: getFormTotal("Interior"),
    exterior: getFormTotal("Exterior"),
    mep: getFormTotal("Mechanical, Electrical and Plumbing Systems"),
  }
  let gTotal = getFormTotal("all");
  let bidApprovalVal = getFormTotal("all", false);

  console.log("IS WORK AUTH CREATED", inspectionData?.doCreateWAF__c);

  const initalEstimateRehab = "0"

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView onScroll={(e) => setOffSetY(e.nativeEvent.contentOffset.y)}>
        {/* {!readOnly && */}
          <Overlay visible={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)}  >
            {
              !(userRole === "Reviewer") ?
                <SubmitReviewForm handleCloseModal={() => setIsSubmitModalOpen(false)} setreadonly={setreadonly} inspVfDetails={vendorFormDetails[inspectionData.Id]} inspId={inspectionData.Id} navigation={navigation} setIsNotesCollapsed={setIsNotesCollapsed} />
                :
                <ReviewerSubmitModal inspId={inspectionData.Id} initalEstimateRehab={initalEstimateRehab} handleCloseModal={() => setIsSubmitModalOpen(false)} bidApprovalVal={bidApprovalVal} navigation={navigation} />
            }
          </Overlay>
        {/* } */}
        {/* Hero */}
        <Hero data={inspectionData} sectionTotals={sectionTotals} isSubmitted={isSubmitted} />
        {/* CTA's */}
        <CTA handleOnChat={() => navigation.navigate("Chat", { inspId: inspectionData.Id })} isReadOnly={readOnly} isForReviewerView={userRole === "Reviewer"} handleSignature={handleSignature} handleViewImages={handleViewImages} isSubmitted={isSubmitted} handleOnSubmit={handleSubmit} />
        {/* Sigantures */}
        {(isSubmitted && showSiganturesView) && <Signatures inspId={inspectionData.Id} role={userRole} />}
        {/* Forms */}
        <OtherForms gTotal={gTotal} isSubmitted={isSubmitted} readOnly={readOnly} isForReviewerView={userRole === "Reviewer"} inspectionData={inspectionData} navigation={navigation} />
      </ScrollView>
      {/* Call Now */}
      {show && <CallNow isForReviewerView={userRole === "Reviewer"} data={inspectionData} />}
    </SafeAreaView>
  )
}


function ReviewerSubmitModal({inspId, handleCloseModal, navigation, bidApprovalVal = 0, initalEstimateRehab }) {

  const handleSave = async () => {
  const res =  await updateSfVendorFormDetails({
      "Bid_Recommendation": bidApprovalVal,
      "Bid_Contingency": parseFloat(bidContingency),
      "Final_Rehab_Scope_Notes": rehabScopeNotes,
      "Form_Stage": "Reviewer Form Completed",
      "Submit_for_Bid_Approval": true
    },inspId,true,"Reviewer");

    console.log("SAVE",res);
    handleCloseModal();
    navigation.goBack();
  }

  const [bidContingency, setBidContingency] = React.useState(10);
  const [rehabScopeNotes, setRehabScopeNotes] = React.useState("");


  return (
    <View style={{ padding: 8, width: "100%" }}>
      <Text style={{ fontFamily: "URBAN_BOLD", fontSize: 18, marginBottom: 16, textAlign: "center" }}>
        Submit for Approval Details
      </Text>
      <Text style={{ fontFamily: "URBAN_BOLD", fontSize: 14, marginBottom: 2 }}>HHM BID RECOMMENDATION</Text>
      <TextInput value={bidApprovalVal?.toLocaleString("en-IN", { style: "currency", currency: 'USD' })} editable={false} style={{ fontFamily: "URBAN_BOLD", fontSize: 16, backgroundColor: "#d9d9d9", padding: 8, marginBottom: 16 }} />
      <Text style={{ fontFamily: "URBAN_BOLD", fontSize: 14, marginBottom: 2 }}>Initial Rehab Estimate</Text>
      <TextInput value={initalEstimateRehab} editable={false} style={{ fontFamily: "URBAN_BOLD", fontSize: 16, backgroundColor: "#d9d9d9", padding: 8, marginBottom: 16 }} />
      <Text style={{ fontFamily: "URBAN_BOLD", fontSize: 14, marginBottom: 2 }}>HHM BID Contingency %</Text>
      <TextInput onChangeText={text => setBidContingency(text)} value={`${bidContingency}`} style={{ fontFamily: "URBAN_BOLD", fontSize: 16, backgroundColor: "#d9d9d980", padding: 8, marginBottom: 16 }} />
      <Text style={{ fontFamily: "URBAN_BOLD", fontSize: 14, marginBottom: 2 }}>Final Rehab Scope Notes</Text>
      <TextInput onChangeText={text => setRehabScopeNotes(text)} value={rehabScopeNotes} style={{ fontFamily: "URBAN_BOLD", fontSize: 16, backgroundColor: "#d9d9d980", padding: 8, marginBottom: 16 }} />
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button onPress={handleSave} mode="contained" style={{ backgroundColor: "#8477eb" }}>Save</Button>
        <Button onPress={() => handleCloseModal()}>Cancel</Button>
      </View>
    </View>
  )
}


function Signatures({ inspId, role }) {


  const updateSignToContext = (image) => {
    addSignature(inspId, image, role)
  }

  React.useEffect(() => {
    contextImages[inspId] && contextImages[inspId].map(ele => {
      let string = ele.file_name;
      let substring1 = "Company_Signature";
      let substring2 = "Contractor_Signature";
      console.log("FILEE", string);
      if (string.includes(substring1)) {
        // console.log(ele.file_public_url, "vfvfvfv");
        console.log("string1");
        setReviewerSignDate(ele.file_name.split(/["Company_Signature_  " .jpg]+/)[1])
        setReviewerImg(ele.file_public_url)
        return
      } else if (string.includes(substring2)) {
        console.log("string2");
        setSignDate(ele.file_name.split(/["Contractor_Signature_  " .jpg]+/)[1])
        setImg(ele.file_public_url)
        return
      }
    })
  }, [contextImages])


  const { addSignature, contextImages } = React.useContext(VendorFormContext);

  const [img, setImg] = React.useState(null)
  const [reviewerImg, setReviewerImg] = React.useState(null);

  const [modalVisible, setModalVisible] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false)
  const [signDate, setSignDate] = React.useState()
  const [reviewerSignDate, setReviewerSignDate] = React.useState()

  const uploadImage = async () => {

    try {

      setIsLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      result = result.base64

      if (result) {
        console.log(result, "kkk");
      role === "Reviewer" ?   setReviewerImg(result) : setImg(result);
        updateSignToContext(result)
        setIsLoading(false);
      }

    } catch (error) {

      setIsLoading(false);
      console.log(error);
      alert('Upload Error' + error)

    }

  }


  if (role === "Reviewer") {
    return (
      <View style={{ flexDirection: "row" }}>
        {/* Contractor Signature */}
        <View style={{ padding: 16, flex: 1, }}>
          <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD', color: 'black' }}>Contractor Signature</Text>
          {img &&
            <>
              <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginVertical: 8, padding: 4 }}>
                <Image style={{
                  width: 80,
                  height: 80
                }} source={{ uri: img }} />
              </View>
              <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD', color: 'black' }}>Date : {signDate}</Text>
            </>
          }
        </View>
        {/* Company Signature */}
        <View style={{ padding: 16, flex: 1, alignItems: "flex-end" }}>
          <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD', color: 'black' }}>Company Signature</Text>
          {reviewerImg &&
            <View style={{ justifyContent: 'center', marginVertical: 8, padding: 4 }}>
              <Image style={{
                width: 80,
                height: 80
              }} source={{ uri: reviewerImg }} />
            </View>}
          {!reviewerImg && <>
            <Button style={{
              backgroundColor: 'black',
              color: "white",
              marginVertical: 2,
              marginTop: 4,
              width: 100,
              fontSize: 28
            }} mode="contained" onPress={() => setModalVisible(true)}>
              Sign
            </Button>
            <Button style={{
              backgroundColor: 'black',
              color: "white",
              marginVertical: 2,
              width: 100,
            }} loading={isLoading} mode="contained" onPress={uploadImage}>
              Upload
            </Button>
          </>}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>


            <Sign onOK={(e) => {
              let bs64dataArray = e.split(',')
              setReviewerImg(e);
              setModalVisible(!modalVisible);
              updateSignToContext(bs64dataArray[1])
              setIsLoading(true);
            }} text='Company Signature' />


          </Modal>
          <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD', color: 'black' }}>Date:{reviewerSignDate}</Text>
        </View>

      </View>
    )
  }


  return (

    <View style={{ flexDirection: "row" }}>
      {/* Contractor Signature */}
      <View style={{ padding: 16, flex: .5 }}>
        <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD', color: 'black' }}>Contractor Signature</Text>
        {img &&
          <View style={{ justifyContent: 'center', marginVertical: 8, padding: 4 }}>
            <Image style={{
              width: 80,
              height: 80
            }} source={{ uri: img }} />
          </View>}
        {img && <Text style={{ fontSize: 12 }}>Date : {new Date().toDateString()}</Text>}
        {!img && <>
          <Button style={{
            backgroundColor: 'black',
            color: "white",
            marginVertical: 2,
            marginTop: 4,
            width: 100,
            fontSize: 28
          }} mode="contained" onPress={() => setModalVisible(true)}>
            Sign
          </Button>
          <Button style={{
            backgroundColor: 'black',
            color: "white",
            marginVertical: 2,
            width: 100,
          }} loading={isLoading} mode="contained" onPress={uploadImage}>
            Upload
          </Button>
        </>}
        {/* <Button title="Sign"  /> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>


          <Sign onOK={(e) => {
            let bs64dataArray = e.split(',')
            setImg(e);
            setModalVisible(!modalVisible);
            updateSignToContext(bs64dataArray[1])
            setIsLoading(true);
          }} text='Contractor Sign' />


        </Modal>
        <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD', color: 'black' }}>Date: {signDate && signDate}</Text>
      </View>
      {/* HHM Signature */}
      <View style={{ padding: 16, flex: 1, }}>
        <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD', color: 'black' }}>HHM Signature</Text>
        {reviewerImg &&
          <>
            <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginVertical: 8, padding: 4 }}>
              <Image style={{
                width: 80,
                height: 80
              }} source={{ uri: reviewerImg }} />
            </View>
            <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD', color: 'black' }}>Date : {reviewerSignDate}</Text>
          </>
        }
      </View>
    </View>
  )
}








export default InspectionDetails