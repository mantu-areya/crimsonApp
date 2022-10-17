import React, { useContext, useEffect, useState } from "react";
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex"
import { getVendorFormDetails } from "../../../services/inspections/inspections.service"
import NetInfo from "@react-native-community/netinfo";
import { View, ScrollView, Pressable, TouchableOpacity, FlatList, TextInput } from "react-native";

import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Toolbar from "../components/detailsView/Toolbar";
import TabMenu from "../components/detailsView/TabMenu";
import InspectionDetails from "../components/detailsView/InspectionDetails";
import RoomMeasurement from "../components/detailsView/RoomMeasurement";
import { NewVendorForm } from "../components/NewVendorForm"
import { ActivityIndicator, Text } from "react-native-paper";
import NewWorkAuthForm from "../components/NewWorkAuthForm";
import { WorkAuthFormPage } from "../components/WorkAuthFormPage";
import { updateSfVendorFormDetails } from "../../../services/inspections/inspections.service";
import Collapsible from 'react-native-collapsible';
import { SubmitReviewForm } from "../components/SubmitReviewForm"
import { SafeAreaView } from "react-native-safe-area-context";
import { Row } from "react-native-responsive-grid-system";
export const InspectionDetailScreen = ({ route, navigation }) => {

  const [isNotesCollapsed, setIsNotesCollapsed] = React.useState(false);
  const [formName, setFormName] = useState('VF')
  const [readOnly, setreadonly] = useState(false)
  const { inspectionData } = route.params;
  const { vendorFormDetails, addToVfContex, addImagesToContex } = useContext(VendorFormContext);
  const setVendorFormData = async () => getVendorFormDetails(inspectionData.Id)
    .then(data => addToVfContex(data["DynamicVendorTemplates"].DynamicVendorTemplate, inspectionData));

  useEffect(() => {
    NetInfo.fetch().then(networkState => {
      if (networkState.isConnected) {
        setVendorFormData();
        addImagesToContex(inspectionData.Id)
      }
      return
    })
  }, []);

  useEffect(() => {
    let stagesArray = ["Work Auth Form Completed","Reviewer Form Completed","Vendor Form Completed"]
    stagesArray.includes(inspectionData.Inspection_Form_Stage__c) && setreadonly(true)
  }, [inspectionData])

  const handleSubmit = () => {
    setIsNotesCollapsed(true)
  }

  const inspectionName = inspectionData.Name

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Toolbar */}
      <Toolbar inspectionName={inspectionName} goBack={() => navigation.goBack()} />

      <ScrollView keyboardDismissMode={'on-drag'}>
        <Row>
          {!readOnly &&
            <Collapsible collapsed={!(isNotesCollapsed)}  >
              <SubmitReviewForm setreadonly={setreadonly} inspVfDetails={vendorFormDetails[inspectionData.Id]} inspId={inspectionData.Id} navigation={navigation} setIsNotesCollapsed={setIsNotesCollapsed} />
            </Collapsible>}
        </Row>
        {/* Tab Menu */}
        <TabMenu {...{ formName, setFormName }} />
        {/* Property Detail Card */}
        <InspectionDetails formName={formName} data={inspectionData} handleSubmit={handleSubmit} />
        {/* Vendor Form */}
        {formName === 'VF' && <NewVendorForm readOnly={readOnly} inspectionData={inspectionData} navigation={navigation} />}
        {/* Work Auth */}
        {
          formName === 'WAF' &&
          <NewWorkAuthForm inspectionData={inspectionData} navigation={navigation} />
        }
      </ScrollView>
    </SafeAreaView>
  )

}
