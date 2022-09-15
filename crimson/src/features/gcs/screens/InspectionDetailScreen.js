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
import RoomMeasurement from "../components/detailsView/RoomMeasurement";
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


  let [general_Rental, setGeneral_Rental] = React.useState([])
  let [pools, setPools] = React.useState([])
  let [exterior, setExterior] = React.useState([])
  let [interior, setInterior] = React.useState([])
  let [mech_Elec_Plumb, setMech_Elec_Plumb] = React.useState([])
  let [grandTotal, setGrandTotal] = useState(0.00)
  let [showMsg, setShowMsg] = React.useState(false)
  // const { vendorFormDetails, updateToSf } = React.useContext(VendorFormContext);

  let [room_MeasurementData, setRoom_MeasurementData] = React.useState([])
  // let [vendorFormData, setVendorFormData] = React.useState([])
  // const { vendorFormDetails, updateToSf } = useContext(VendorFormContext);
  // const [selectedCategory, setSelectedCategory] = React.useState('')
  // const [formNum, setFormNum] = React.useState('')
  // const catselected = useRef('')
  // const isFocused = useIsFocused();

  const getDataByCategory = (inspData) => {
    let room_msrmnt = []
    let category1 = []
    let category2 = []
    let category3 = []
    let category4 = []
    let category5 = []
    let grandTtl = 0.00;

    Object.keys(inspData).map(item => {
      if (inspData[item].Category === "Room Measurements") {
        room_msrmnt.push(inspData[item])
      }
      else if (inspData[item].Category === "General Rental Operations Scope") {
        category1.push(inspData[item])
      } else if (inspData[item].Category === "Pools") {
        category2.push(inspData[item])

      } else if (inspData[item].Category === "Exterior") {
        category3.push(inspData[item])

      } else if (inspData[item].Category === "Interior") {
        category4.push(inspData[item])

      } else if (inspData[item].Category === "Mechanical, Electrical and Plumbing Systems") {
        category5.push(inspData[item])

      }
      if (inspData[item].Category !== "Room Measurements") {
        grandTtl = grandTtl + (inspData[item].Total)
      }

    })
    setRoom_MeasurementData(room_msrmnt);
    setGeneral_Rental(category1);
    setPools(category2);
    setExterior(category3);
    setInterior(category4);
    setMech_Elec_Plumb(category5);
    setGrandTotal(grandTtl)
    setVendorFormData(inspData)
  }

  React.useEffect(() => {
    let contexRecord = vendorFormDetails[inspectionData.Id]
    if (contexRecord) {
      if (contexRecord == "NA") {
        setShowMsg(true)
      }
      else {
        getDataByCategory(contexRecord)
      }
    }
  }, [vendorFormDetails]);

  const renderNoVFText = () => {
    return <View>
      <Text > VENDOR FORM IS NOT AVAILABLE</Text>
    </View>
  }


  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <ScrollView keyboardDismissMode={'on-drag'}>
        {/* Toolbar */}
        <Toolbar inspectionName={inspectionName} goBack={() => navigation.goBack()} />
        {/* Tab Menu */}
        <TabMenu {...{ formName, setFormName }} />
        {/* Property Detail Card */}
        <InspectionDetails data={inspectionData} />
        {/* Grand Total */}
        {/* Room Measurement */}
        <RoomMeasurement room_Measurement={room_MeasurementData} inspId={inspectionData.Id} />
        {/* Other Form TabMenu */}
        <OtherFormTabMenu />
      </ScrollView>
    </SafeAreaView>
  )

}


function OtherFormTabMenu() {
  const [form, setForm] = React.useState("Pools")
  return (
    <View style={{ borderRadius: 8, padding: 8, backgroundColor: "#D9D9D9", }}>

      <ScrollView horizontal style={{ marginVertical: 8, paddingHorizontal: 8 }}>
        <View style={{ flexDirection: 'row' }}>
          {
            [
              "General Rental Operations Scope",
              "Pools",
              "Exterior",
              "Interior",
              "Mechanical, Electrical and Plumbing Systems"
            ].map((item, i) => <Button onPress={() => setForm(item)} mode={form === item ? 'contained' : 'text'} key={i} style={{ marginRight: 8, width: 120 }}>
              {item}
            </Button>)
          }
        </View>
      </ScrollView>
      <View style={{ alignItems: "flex-end", marginTop: 8 }}>
        <Text style={{ fontSize: 16, fontFamily: 'SF_BOLD' }}>
          Grand Total: $10000
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'SF_BOLD' }}>
          Total: $1000
        </Text>
      </View>
    </View>
  )
}


function OtherCategoryForm() {

  return (
    <FlatList
      data={inspections !== null && inspections}
      keyExtractor={(item) => item.Name}
      renderItem={(item) => (
        <ListViewCard data={item} />
      )}
    />
  )

}








