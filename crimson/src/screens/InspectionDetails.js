import { ScrollView, Text, View, TextInput, Modal, Image, Platform } from 'react-native'
import React from 'react'
import styled from "styled-components/native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import CallNow from '../components/inspection-details/CallNow'
import Hero from '../components/inspection-details/Hero'
import CTA from '../components/inspection-details/CTA'
import { VendorFormContext } from '../services/context/VendorForm/vendorForm.contex'
import { getVendorFormDetails, updateSfVendorFormDetails } from '../services/inspections/inspections.service'
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import OtherForms from '../components/inspection-details/vendor-form/OtherForms'
import { SubmitReviewForm } from '../features/gcs/components/SubmitReviewForm'
import Overlay from 'react-native-modal-overlay'
import { InspectionsContext } from '../services/inspections/inspections.contex'
import { AuthenticationContext } from '../services/authentication/authentication.context'
import { ActivityIndicator, Button, } from 'react-native-paper'
import Sign from '../features/gcs/components/workAuth/Sign.js';
import * as ImagePicker from "expo-image-picker";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import CoForms from '../components/ co-forms/CoForms'
import { showMessage } from 'react-native-flash-message'



const InspectionDetails = ({ route, navigation }) => {

  const [show, setShow] = React.useState(false);
  const [offSetY, setOffSetY] = React.useState(0);

  const { user } = React.useContext(AuthenticationContext);

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

  const { vendorFormDetails, addToVfContex, addImagesToContex, contextImages } = React.useContext(VendorFormContext);
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

  console.log({ userRole });



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


  // React.useEffect(() => {
  //   if (contextImages[inspectionData.Id]?.length > 0) {
  //     const index = contextImages[inspectionData.Id].findIndex(file => file.file_name.includes("Signature"))
  //     setShowSiganturesView(index > -1);
  //   }
  // }, [contextImages[inspectionData.Id]?.length])


  const [currentRecord, setCurrentRecord] = React.useState();
  const [isScreenLoading, setIsScreenLoading] = React.useState(false);


  React.useEffect(() => {

    setIsScreenLoading(true);

    let record = vendorFormDetails[inspectionData.Id];
    if (record !== undefined || record !== "NA") {
      setCurrentRecord(record);
      setIsScreenLoading(false);
    } else {
      alert("Vendor Form Not Available")
      setIsScreenLoading(false);
      navigation.goBack();
    }

  }, [inspectionData, vendorFormDetails])


  function getFormTotal(formCategory, formatted = true) {
    let total = 0;
    if (formCategory === "all") {
      currentRecord && currentRecord?.forEach(ele => {
        if (ele.Approval_Status === "Approved" || ele.Approval_Status === "Approved as Noted") {
          total += ele.Approved_Amount;
        }
      });
      return formatted ? total.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : total;
    }
    currentRecord && currentRecord?.forEach(ele => {
      if (ele.Category === formCategory && (ele.Approval_Status === "Approved" || ele.Approval_Status === "Approved as Noted")) {
        total += ele.Approved_Amount;
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
  console.log("FORM STAGE", inspectionData?.Inspection_Form_Stage__c);
  console.log("CURR INSP NAME", inspectionData?.Name);
  console.log("CURR INSP ID", inspectionData?.Id);

  const initalEstimateRehab = "0"

  const getRoomMeasurementTotal = () => {
    let toatalSF = 0;
    currentRecord && currentRecord.map(ele => {
      toatalSF = toatalSF + ele.Room_Total
      return toatalSF
    })
    return toatalSF + " sqft"
  }

  const getTotalBidSubmitted = () => {

    let toatalSF = 0;
    currentRecord && Object.keys(currentRecord).map(item => {
      if (currentRecord[item].Category !== "Room Measurements") {
        toatalSF = toatalSF + (currentRecord[item].Total)
      }
    })
    return toatalSF.toLocaleString("en-IN", { style: "currency", currency: 'USD' })
  }


  const [hasRequiredSign, setHasRequiredSign] = React.useState(false);

  // for current role if not signed show sign prompt otherwise show signed message
  // add sign to modal and provide cross button to close modal


  // Handle CO FORM CHANGE VIEW
  const [showCoForm, setShowCoForm] = React.useState(false);

  // Check if app is offline

  const netInfo = useNetInfo()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {
        isScreenLoading ?
          <View>
            <ActivityIndicator />
          </View>
          :
          <>
            {
              !(netInfo.isConnected) &&
              <View style={{ width: "100%", zIndex: 48, padding: 8, backgroundColor: "orange", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontFamily: "URBAN_BOLD" }}>No Internet.</Text>
                <Text style={{ fontFamily: "URBAN_MEDIUM" }}>App working in offline mode</Text>
              </View>
            }

            <ScrollView onScroll={(e) => e.nativeEvent.contentOffset.y < 500 ? setShow(true) : setShow(false)} scrollEventThrottle={16}>
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
              <Hero handleViewImageGallery={handleViewImages} totalBidSubmitted={getTotalBidSubmitted()} roomMeasurementTotal={getRoomMeasurementTotal()} data={inspectionData} sectionTotals={sectionTotals} isSubmitted={isSubmitted} />
              {/* CTA's */}
              <CTA showCoForms={showCoForm} handleShowCoForms={() => setShowCoForm(!showCoForm)} hasRequiredSign={hasRequiredSign} formStatus={inspectionData?.Inspection_Form_Stage__c} role={userRole} handleOnChat={() => navigation.navigate("Chat", { inspId: inspectionData.Id, chatTitleName: userRole === "Contractor" ? inspectionData?.HHM_Field_PM__r?.Name : inspectionData.General_Contractor__r?.Name })} isReadOnly={readOnly} isForReviewerView={userRole === "Reviewer"} handleSignature={handleSignature} handleViewImages={handleViewImages} isSubmitted={isSubmitted} handleOnSubmit={handleSubmit} />
              {/* Sigantures */}
              {(isSubmitted && !hasRequiredSign) && <Signatures navigation={navigation} inspectionData={inspectionData} inspId={inspectionData.Id} role={userRole} hasRequiredSign={hasRequiredSign} setHasRequiredSign={setHasRequiredSign} />}
              {/* Forms */}
              {
                showCoForm
                  ? <CoForms sectionTotals={sectionTotals} gTotal={gTotal} isSubmitted={isSubmitted} readOnly={readOnly} isForReviewerView={userRole === "Reviewer"} formStatus={inspectionData?.Inspection_Form_Stage__c} inspectionData={inspectionData} navigation={navigation} setVendorFormData={setVendorFormData} />
                  : <OtherForms sectionTotals={sectionTotals} gTotal={gTotal} isSubmitted={isSubmitted} readOnly={readOnly} isForReviewerView={userRole === "Reviewer"} formStatus={inspectionData?.Inspection_Form_Stage__c} inspectionData={inspectionData} navigation={navigation} setVendorFormData={setVendorFormData} />

              }
            </ScrollView>
            {Platform.OS == 'ios' && <KeyboardSpacer />}
            {/* Call Now */}
            {show && <CallNow isForReviewerView={userRole === "Reviewer"} data={inspectionData} />}
          </>

      }
    </SafeAreaView>
  )
}


function ReviewerSubmitModal({ inspId, handleCloseModal, navigation, bidApprovalVal = 0, initalEstimateRehab }) {

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await updateSfVendorFormDetails({
        "Bid_Recommendation": bidApprovalVal,
        "Bid_Contingency": parseFloat(bidContingency),
        "Final_Rehab_Scope_Notes": rehabScopeNotes,
        "Form_Stage": "Reviewer Form Completed",
        "Submit_for_Bid_Approval": true
      }, inspId, true, "Reviewer");

      console.log("SAVE", res);
      handleCloseModal();
      navigation.goBack();
      alert("Submitted Successfully")
    } catch (error) {
      console.log("REVIEWER SUBMIT ERR", err.message);
    } finally {
      setIsSubmitting(false);
    }
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
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#d9d9d980", padding: 8, marginBottom: 16 }}>
        <TextInput editable={!isSubmitting} onChangeText={text => setBidContingency(text)} value={`${bidContingency}`} style={{ fontFamily: "URBAN_BOLD", fontSize: 16 }} />
        <Text>%</Text>
      </View>
      {/* <TextInput onChangeText={text => setBidContingency(text)} value={`${bidContingency}`} style={{ fontFamily: "URBAN_BOLD", fontSize: 16, backgroundColor: "#d9d9d980", padding: 8, marginBottom: 16 }} /> */}
      <Text style={{ fontFamily: "URBAN_BOLD", fontSize: 14, marginBottom: 2 }}>Final Rehab Scope Notes</Text>
      <TextInput editable={!isSubmitting} onChangeText={text => setRehabScopeNotes(text)} value={rehabScopeNotes} style={{ fontFamily: "URBAN_BOLD", fontSize: 16, backgroundColor: "#d9d9d980", padding: 8, marginBottom: 16 }} />
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button disabled={isSubmitting} loading={isSubmitting} onPress={handleSave} mode="contained">{isSubmitting ? "Saving..." : "Save"}</Button>
        <Button disabled={isSubmitting} onPress={() => handleCloseModal()}>Cancel</Button>
      </View>
    </View>
  )
}


function Signatures({ navigation, inspId, role, inspectionData, hasRequiredSign, setHasRequiredSign }) {


  const updateSignToContext = (image) => {
    addSignature(inspId, image, role)
  }


  const {
    Work_Authorization_Signed_Date_GC__c: gcSignDate,
    Work_Authorization_Date_Signed__c: rSignDate
  } = inspectionData

  console.log({
    gcSignDate,
    rSignDate
  });


  React.useEffect(() => {
    if (gcSignDate && role === "Contractor") {
      console.log("true...");
      setHasRequiredSign(true);
    }
    if (rSignDate && role === "Reviewer") {
      console.log("SETTING...");
      setHasRequiredSign(true);
    }
    console.log("RUNNNING...");
  }, [gcSignDate,
    rSignDate])


  const { addSignature } = React.useContext(VendorFormContext);

  const [modalVisible, setModalVisible] = React.useState(false);

  const [loader, setLoader] = React.useState(false);


  const handleOK = (e) => {
    let bs64dataArray = e.split(',')
    setLoader(true);
    updateSignToContext(bs64dataArray[1])
    setTimeout(() => {
      setModalVisible(!modalVisible);
      setLoader(false);
      showMessage({
        type: "success",
        message: "Signature added successfully"
      })
      navigation.goBack()
    }, 5000)
    // navigation.goBack()
  }


  return (

    <View >
      {
        loader
          ? <ActivityIndicator />
          :
          <View style={{ padding: 16 }}>
            <SubmitButtonWrapper mode="contained" onPress={() => setModalVisible(true)}>
              <ButtonText style={{ textAlign: 'center' }} color="white">
                Add Signature
              </ButtonText>
            </SubmitButtonWrapper>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <Sign
                onOK={(e) => handleOK(e)} text={role === "Reviewer" ? "HHM Signature" : "Contractor Signature"}
                handleOnCancel={() => setModalVisible(false)}
              />

            </Modal>
          </View>
      }
    </View>
  )
}



const SubmitButtonWrapper = styled.TouchableOpacity`
background-color:#8477EB;
padding: 8px 16px;
justify-content:center;
align-items:center;
width: 248px;
margin: 0 auto;
`;

const ButtonText = styled.Text`
font-size:${Platform.OS === "android" ? 16 : 18}px;
font-family: 'URBAN_BOLD';
/* text-transform: uppercase; */
color: ${props => props.color || 'black'};
margin-left: ${props => `${props.marginLeft || 0}px`} ;
`;





export default InspectionDetails