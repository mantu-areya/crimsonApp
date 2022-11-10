import { ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import CallNow from '../components/inspection-details/CallNow'
import Hero from '../components/inspection-details/Hero'
import CTA from '../components/inspection-details/CTA'
import { VendorFormContext } from '../services/context/VendorForm/vendorForm.contex'
import { getVendorFormDetails } from '../services/inspections/inspections.service'
import NetInfo from "@react-native-community/netinfo";
import OtherForms from '../components/inspection-details/vendor-form/OtherForms'
import { SubmitReviewForm } from '../features/gcs/components/SubmitReviewForm'
import Overlay from 'react-native-modal-overlay'
import { InspectionsContext } from '../services/inspections/inspections.contex'


const InspectionDetails = ({ route, navigation }) => {

  const [show, setShow] = React.useState(false);
  const [offSetY, setOffSetY] = React.useState(0);

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
    if (userRole === "Reviewer") {
      console.log("Submitting for REVIEWER");
      setIsSubmitted(true); // TODO: Handle Submit for Reviewer
    }
    console.log("Submitting for GC");
    setIsSubmitModalOpen(true); // handle  Submit for GC
  }



  const handleSignature = () => { };
  const handleViewImages = () => {
    navigation.navigate("ImageGallery",{inspId: inspectionData.Id});
   }

  const [isSubmitted, setIsSubmitted] = React.useState(inspectionData?.doCreateWAF__c || false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = React.useState(false);

  console.log("CURRENT INSPECTION", inspectionData.Id);


  let currentRecord = vendorFormDetails[inspectionData.Id];

  function getFormTotal(formCategory) {
    let total = 0;
    if (formCategory === "all") {
      currentRecord && currentRecord.forEach(ele => {
        if (ele.Approval_Status === "Approved" || ele.Approval_Status === "Approved as Noted") {
          total += ele.Total;
        }
      });
      return total.toLocaleString("en-IN", { style: "currency", currency: 'USD' });
    }
    currentRecord && currentRecord.forEach(ele => {
      if (ele.Category === formCategory && (ele.Approval_Status === "Approved" || ele.Approval_Status === "Approved as Noted")) {
        total += ele.Total;
      }
    });

    return total.toLocaleString("en-IN", { style: "currency", currency: 'USD' });
  }

  let sectionTotals = {
    grs: getFormTotal("General Rental Operations Scope"),
    pools: getFormTotal("Pools"),
    interior: getFormTotal("Interior"),
    exterior: getFormTotal("Exterior"),
    mep: getFormTotal("Mechanical, Electrical and Plumbing Systems"),
  }
  let gTotal = getFormTotal("all");

 console.log("IS WORK AUTH CREATED",inspectionData?.doCreateWAF__c);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView onScroll={(e) => setOffSetY(e.nativeEvent.contentOffset.y)}>
        {!readOnly &&
          <Overlay visible={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)}  >
            <SubmitReviewForm handleCloseModal={() => setIsSubmitModalOpen(false)} setreadonly={setreadonly} inspVfDetails={vendorFormDetails[inspectionData.Id]} inspId={inspectionData.Id} navigation={navigation} setIsNotesCollapsed={setIsNotesCollapsed} />
          </Overlay>
        }
        {/* Hero */}
        <Hero data={inspectionData} sectionTotals={sectionTotals} isSubmitted={isSubmitted} />
        {/* CTA's */}
        <CTA handleOnChat={() => navigation.navigate("Chat",{inspId:inspectionData.Id})} isReadOnly={readOnly} isForReviewerView={userRole === "Reviewer"} handleSignature={handleSignature} handleViewImages={handleViewImages} isSubmitted={isSubmitted} handleOnSubmit={handleSubmit} />
        {/* Forms */}
        <OtherForms gTotal={gTotal} isSubmitted={isSubmitted} readOnly={readOnly} isForReviewerView={userRole === "Reviewer"} inspectionData={inspectionData} navigation={navigation} />
      </ScrollView>
      {/* Call Now */}
      {show && <CallNow isForReviewerView={userRole === "Reviewer"} data={inspectionData} />}
    </SafeAreaView>
  )
}









export default InspectionDetails