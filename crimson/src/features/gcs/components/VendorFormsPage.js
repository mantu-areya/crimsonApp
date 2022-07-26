
import React, { useEffect, useState, useContext, Component, useRef } from "react";
// import { Row } from "../components/ProcessRecordsInfoCardStyle";
import { Image, View, ScrollView, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Row, Col } from 'react-native-responsive-grid-system';
import { Dimensions } from 'react-native';
import { InspectionDetailTile } from "./InspectionDetailTile";
import { RoomForm } from "./RoomForm";
import { OtherCategoryForms } from "./OtherCategoryForms";
import { TotalContainer, InfoTextArea, ActionContainer, HeaderCardCover, BackNavigator, HeaderCard, Body, CarousalScrren } from "./VendorFormPageStyles";
import { ActivityIndicator } from "react-native-paper";
import { InspectionDetailsCard } from "./InspectionDetailsCard"
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { ViewCarousal } from "../../../utilities/ViewCarousalComponent/ViewCarousal";



const { width, height } = Dimensions.get('window');








const windowWidth = Dimensions.get('window').width;
const IconWidth = .30 * windowWidth;
const BrandIcon = styled(Image)`
resizeMode: stretch;
`
const Loading = styled(ActivityIndicator)`
  margin-left: -25px;
`;
const LoadingContainer = styled.View`
margin-top:50%;
`;





export const VendorFormsPage = ({ inspectionData, navigation }) => {
  // let [room_Measurement, setRoom_Measurement] = React.useState({ ROOM: [], LENGTH: [], WIDTH: [], MISC_SF: [], TOTAL: [] })
  let [general_Rental, setGeneral_Rental] = React.useState([])
  let [pools, setPools] = React.useState([])
  let [exterior, setExterior] = React.useState([])
  let [interior, setInterior] = React.useState([])
  let [mech_Elec_Plumb, setMech_Elec_Plumb] = React.useState([])
  let [grandTotal, setGrandTotal] = useState(0.00)
  let [showMsg, setShowMsg] = React.useState(false)
  let [room_MeasurementData, setRoom_MeasurementData] = React.useState([])
  let [vendorFormData, setVendorFormData] = React.useState([])
  const { vendorFormDetails, updateToSf } = useContext(VendorFormContext);
  let [showMoreForm, setShowMoreForm] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState('')
  const [formNum, setFormNum] = React.useState('')
  const catselected = useRef('')

  const GetDataByCategory = (inspData) => {
    let room_msrmnt = []
    let category1 = []
    let category2 = []
    let category3 = []
    let category4 = []
    let category5 = []
    let grandTtl = 0.00;

    Object.keys(inspData).map(item => {
      if (inspData[item].Category__c === "Room Measurements") {
        room_msrmnt.push(inspData[item])
      }
      else if (inspData[item].Category__c === "General Rental Operations Scope") {
        category1.push(inspData[item])
      } else if (inspData[item].Category__c === "Pools") {
        category2.push(inspData[item])

      } else if (inspData[item].Category__c === "Exterior") {
        category3.push(inspData[item])

      } else if (inspData[item].Category__c === "Interior") {
        category4.push(inspData[item])

      } else if (inspData[item].Category__c === "Mechanical, Electrical and Plumbing Systems") {
        category5.push(inspData[item])

      }
      if (inspData[item].Category__c !== "Room Measurements") {
        grandTtl = grandTtl + (inspData[item].Total__c)
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


useEffect(()=>{
    updateToSf(inspectionData.Id)
},[formNum])

  useEffect(() => {
    let contexRecord = vendorFormDetails[inspectionData.Id]
    if (contexRecord ) {
      if (contexRecord == "NA") {
        setShowMsg(true)
      }
      else {
        GetDataByCategory(contexRecord)
      }
    }
  }, [vendorFormDetails]);





  const renderNoVFText = () => {
    return <InfoTextArea>
      <Text variant="InspectionHeaderName" > VENDOR FORM IS NOT AVAILABLE</Text>
    </InfoTextArea>
  }


  return (<>
   
    <SafeArea>
      <ScrollView keyboardDismissMode={'on-drag'} onMomentumScrollBegin={() => (setShowMoreForm(true))}>
        <HeaderCard  >
          <BackNavigator onPress={() => { navigation.goBack() }}><Row><Icon name="arrow-left" size={20} color="white" style={{ marginTop: 4 }} /><Text variant="NavigationText">Back</Text></Row></BackNavigator>
          {/* <Spacer position="left" size="small" /> */}
          <View>
            <Row>
              <Text variant="InspectionHeaderName">{inspectionData.Name} | </Text>
              <Text variant="InspectionHeaderName">VENDOR ESTIMATE FORM</Text>
            </Row>
            <Text variant="HeaderName">{inspectionData.Property_Address__c} </Text>
          </View>
          <Spacer position="top" size="large" />
          <InspectionDetailsCard inspectionData={inspectionData} />
          <Spacer position="bottom" size="medium" />

        </HeaderCard  >
        <Body>
          <Spacer position="top" size="medium" />


          {showMsg ? renderNoVFText() : <>
            <Spacer position="top" size="medium" />
            <ActionContainer>
              <TotalContainer>
                <Text>GRAND TOTAL BID SUBMITTED : ${grandTotal.toLocaleString("en-US")}</Text>
                {/* <Text>GRAND TOTAL BID SUBMITTED : $2,265.81</Text> */}
                <Spacer position="right" size="large" />
              </TotalContainer>
            </ActionContainer>
            <Spacer position="top" size="large" />

            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>

            </View>
            <ViewCarousal setFormNum={setFormNum} >
              <CarousalScrren >
                <RoomForm room_Measurement={room_MeasurementData}  inspId={inspectionData.Id} />
              </CarousalScrren>
              <CarousalScrren >
               {formNum==1 && <OtherCategoryForms catName={"GENERAL RENTAL OPERATIONS SCOPE"} formData={general_Rental} inspId={inspectionData.Id} />}
              </CarousalScrren >
              <CarousalScrren >
              {formNum==2 &&<OtherCategoryForms catName={"Pools"} formData={pools}  inspId={inspectionData.Id}/>}
              </CarousalScrren >
              <CarousalScrren >
              {formNum==3 && <OtherCategoryForms catName={"Exterior"} formData={exterior} inspId={inspectionData.Id}/>}
              </CarousalScrren>
              <CarousalScrren >
              {formNum==4 && <OtherCategoryForms catName={"Interior"} formData={interior} inspId={inspectionData.Id}/>}
              </CarousalScrren>
              <CarousalScrren >
              {formNum==5 && <OtherCategoryForms catName={"Mechanical, Electrical and Plumbing Systems"} formData={mech_Elec_Plumb} inspId={inspectionData.Id}/>}
              </CarousalScrren>
            </ViewCarousal>

          </>}
        </Body>
      </ScrollView>
    </SafeArea>
  </>
  )
}


