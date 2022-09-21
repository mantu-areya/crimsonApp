import React, { useContext, useEffect, useState } from "react";
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex"
import { getVendorFormDetails } from "../../../services/inspections/inspections.service"
import NetInfo from "@react-native-community/netinfo";
import { View, ScrollView, Pressable, SafeAreaView, TouchableOpacity, FlatList, TextInput } from "react-native";

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
export const InspectionDetailScreen = ({ route, navigation }) => {


  const [formName, setFormaName] = useState('VF')
  const [readonly, setreadonly] = useState(false)
  const { inspectionData } = route.params;
  const { addToVfContex } = useContext(VendorFormContext);
  const setVendorFormData = async () => getVendorFormDetails(inspectionData.Id)
    .then(data => addToVfContex(data, inspectionData));

  useEffect(() => {
    NetInfo.fetch().then(networkState => {
      if (networkState.isConnected) {
        setVendorFormData();
      }
      return
    })
  }, []);

  useEffect(() => {
    inspectionData.Vendor_Bid_Submission_Complete__c && setreadonly(true)
  }, [inspectionData])

  const handleSubmit = () => {
    setreadonly(true)
    updateSfVendorFormDetails(vendorFormDetails[inspectionData.Id], inspectionData.Id, true).then(result => {
      navigation.navigate('HomeStack')
    })
  }

  const inspectionName = inspectionData.Name

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Toolbar */}
      <Toolbar inspectionName={inspectionName} goBack={() => navigation.goBack()} />

      <ScrollView keyboardDismissMode={'on-drag'}>
        {/* Tab Menu */}
        <TabMenu {...{ formName, setFormName }} />
        {/* Property Detail Card */}
        <InspectionDetails data={inspectionData} />
        {/* Vendor Form */}
        {formName === 'VF' && <NewVendorForm inspectionData={inspectionData} navigation={navigation} />}
        {/* Work Auth */}
        {
          formName === 'WAF' &&
          <NewWorkAuthForm inspectionData={inspectionData} navigation={navigation} />
        }
      </ScrollView>
    </SafeAreaView>
  )

}
