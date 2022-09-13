import React, { useContext, useEffect, useState } from "react";
import { VendorFormsPage } from "../components/VendorFormsPage"
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex"
import { getVendorFormDetails } from "../../../services/inspections/inspections.service"
import NetInfo from "@react-native-community/netinfo";
import { View, ScrollView, Pressable, SafeAreaView, TouchableOpacity } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { TotalContainer, InfoTextArea, ActionContainer, HeaderCardCover, BackNavigator, HeaderCard, Body, CarousalScrren } from "../components/VendorFormPageStyles";
import { Row, Col } from 'react-native-responsive-grid-system';
import { Spacer } from "../../../components/spacer/spacer.component";
import { InspectionDetailTile } from "../components/InspectionDetailTile";
import { InspectionDetailsCard } from "../components/InspectionDetailsCard"
import { Text } from "../../../components/typography/text.component";
import { FormSections, FormSectionsContainer } from "./InspectionDetailScreenStyles"
import { WorkAuthFormPage } from "../components/WorkAuthFormPage";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Chip, IconButton } from "react-native-paper";
import Toolbar from "../components/detailsView/Toolbar";
import TabMenu from "../components/detailsView/TabMenu";
import InspectionDetails from "../components/detailsView/InspectionDetails";
const backIcon = <Icon name="arrow-left" size={12} />;


export const InspectionDetailScreen = ({ route, navigation }) => {


  const [formName, setFormName] = useState('VF')
  const { inspectionData } = route.params;
  const { vendorFormDetails, addToVfContex } = useContext(VendorFormContext);
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


  const inspectionName = inspectionData.Name

  // console.log({inspectionData});


  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrollView keyboardDismissMode={'on-drag'}>
        {/* Toolbar */}
        <Toolbar inspectionName={inspectionName} goBack={() => navigation.goBack()} />
        {/* Tab Menu */}
        <TabMenu {...{formName,setFormName}} />
        {/* Property Detail Card */}
        <InspectionDetails data={inspectionData} />
      </ScrollView>
    </SafeAreaView>
  )

}











