import { View, ScrollView, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import CallNow from '../components/inspection-details/CallNow'
import Hero from '../components/inspection-details/Hero'
import CTA from '../components/inspection-details/CTA'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import styled from 'styled-components/native'
import { VendorFormContext } from '../services/context/VendorForm/vendorForm.contex'
import { getVendorFormDetails } from '../services/inspections/inspections.service'
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from '@react-navigation/native'
import OtherForms from '../components/inspection-details/vendor-form/OtherForms'
import { Row } from 'react-native-responsive-grid-system'
import Collapsible from 'react-native-collapsible'
import { SubmitReviewForm } from '../features/gcs/components/SubmitReviewForm'



const menuItems = [
  {
    title: 'General Rental Operations Scope',
    icon: <MaterialCommunityIcons size={28} name='home-city' color={"#DE9B67"} />
  },
  {
    title: 'Interior',
    icon: <MaterialCommunityIcons size={28} name='home-account' color={"#36905C"} />

  },
  {
    title: 'Exterior',
    icon: <MaterialCommunityIcons size={28} name='home' color={"#7A8AE7"} />

  },
  {
    title: 'Pools',
    icon: <MaterialIcons size={28} name='pool' color={"#DE9B67"} />

  },
  {
    title: 'Mechianical',
    icon: <MaterialIcons size={28} name='handyman' color={"#F1A8AC"} />
  },
]

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
  const [readOnly, setreadonly] = React.useState(false)
  const { inspectionData } = route.params;
  const { vendorFormDetails, addToVfContex, addImagesToContex } = React.useContext(VendorFormContext);
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

  const handleSubmit = () => {
    setIsNotesCollapsed(true)
  }

  const inspectionName = inspectionData.Name




  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView onScroll={(e) => setOffSetY(e.nativeEvent.contentOffset.y)}>
        <Row>
          {!readOnly &&
            <Collapsible collapsed={!(isNotesCollapsed)}  >
              <SubmitReviewForm setreadonly={setreadonly} inspVfDetails={vendorFormDetails[inspectionData.Id]} inspId={inspectionData.Id} navigation={navigation} setIsNotesCollapsed={setIsNotesCollapsed} />
            </Collapsible>}
        </Row>
        {/* Hero */}
        <Hero />
        {/* CTA's */}
        <CTA handleOnChat={() => alert("Chat")} handleOnSubmit={handleSubmit} />
        {/* Forms */}
        <OtherForms readOnly={readOnly} inspectionData={inspectionData} navigation={navigation} />
      </ScrollView>
      {/* Call Now */}
      {show && <CallNow />}
    </SafeAreaView>
  )
}









export default InspectionDetails