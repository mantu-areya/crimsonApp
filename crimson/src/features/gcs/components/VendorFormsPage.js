
import React, { useEffect, useState } from "react";
// import { Row } from "../components/ProcessRecordsInfoCardStyle";
import {  Image, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Row, Col } from 'react-native-responsive-grid-system';
import { Dimensions } from 'react-native';
import { InspectionDetailTile } from "./InspectionDetailTile";
import { getVendorFormDetails } from "../../../services/inspections/inspections.service"
import { RoomForm } from "./RoomForm";
import { OtherCategoryForms } from "./OtherCategoryForms";
import { TotalContainer, InfoTextArea, ActionContainer,HeaderCardCover, HeaderCardBody, HeaderCard,Body } from "./VendorFormPageStyles";
import { ActivityIndicator, Colors } from "react-native-paper";
import { InspectionDetailsCard } from "./InspectionDetailsCard"
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex";
import { StatusBar } from 'expo-status-bar';









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


export const VendorFormsPage = ({ inspectionData }) => {
  let [room_Measurement, setRoom_Measurement] = React.useState({ ROOM: [], LENGTH: [], WIDTH: [], MISC_SF: [], TOTAL: [] })
  let [general_Rental, setGeneral_Rental] = React.useState({ MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [] })
  let [pools, setPools] = React.useState({ MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [] })
  let [exterior, setExterior] = React.useState({ MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [] })
  let [interior, setInterior] = React.useState({ MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [] })
  let [mech_Elec_Plumb, setMech_Elec_Plumb] = React.useState({ MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [] })
  let [grandTotal, setGrandTotal] = useState(0.00)
  let [showMsg, setShowMsg] = React.useState(false)



  const GetDataByCategory = (inspData) => {
    let DataByCategory = {}
    let room_msrmnt = { ROOM: [], LENGTH: [], WIDTH: [], MISC_SF: [], TOTAL: [], KEY: [], SEQUENCE: [] }
    let category1 = { MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [], KEY: [], SEQUENCE: [] }
    let category2 = { MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [], KEY: [], SEQUENCE: [] }
    let category3 = { MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [], KEY: [], SEQUENCE: [] }
    let category4 = { MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [], KEY: [], SEQUENCE: [] }
    let category5 = { MATRIX_PRICE: [], SCOPE_NOTES: [], QTY: [], U_M: [], RATE: [], TOTAL: [], KEY: [], SEQUENCE: [] }
    let grandTtl = 0.00;
    Object.keys(inspData).map(item => {
      if (inspData[item].Category__c === "Room Measurements") {
        room_msrmnt.ROOM.push(inspData[item].Sub_Category__c)
        room_msrmnt.LENGTH.push(inspData[item].Room_Length__c)
        room_msrmnt.WIDTH.push(inspData[item].Room_Width__c)
        room_msrmnt.MISC_SF.push(inspData[item].Room_Misc_SF__c)
        room_msrmnt.TOTAL.push(inspData[item].Room_Total__c)
        room_msrmnt.KEY.push(inspData[item].UniqueKey__c)
        room_msrmnt.SEQUENCE.push(inspData[item].Sequence__c)

      }
      else if (inspData[item].Category__c === "General Rental Operations Scope") {
        category1.MATRIX_PRICE.push(inspData[item].Sub_Category__c)
        category1.SCOPE_NOTES.push(inspData[item].Scope_Notes__c)
        category1.QTY.push(inspData[item].Quantity__c)
        category1.U_M.push(inspData[item].U_M__c)
        category1.RATE.push(inspData[item].Rate__c)
        category1.TOTAL.push(inspData[item].Total__c)
        category1.KEY.push(inspData[item].UniqueKey__c)
        category1.SEQUENCE.push(inspData[item].Sequence__c)
      } else if (inspData[item].Category__c === "Pools") {
        category2.MATRIX_PRICE.push(inspData[item].Sub_Category__c)
        category2.SCOPE_NOTES.push(inspData[item].Scope_Notes__c)
        category2.QTY.push(inspData[item].Quantity__c)
        category2.U_M.push(inspData[item].U_M__c)
        category2.RATE.push(inspData[item].Rate__c)
        category2.TOTAL.push(inspData[item].Total__c)
        category2.KEY.push(inspData[item].UniqueKey__c)
        category2.SEQUENCE.push(inspData[item].Sequence__c)
      } else if (inspData[item].Category__c === "Exterior") {
        category3.MATRIX_PRICE.push(inspData[item].Sub_Category__c)
        category3.SCOPE_NOTES.push(inspData[item].Scope_Notes__c)
        category3.QTY.push(inspData[item].Quantity__c)
        category3.U_M.push(inspData[item].U_M__c)
        category3.RATE.push(inspData[item].Rate__c)
        category3.TOTAL.push(inspData[item].Total__c)
        category3.KEY.push(inspData[item].UniqueKey__c)
        category3.SEQUENCE.push(inspData[item].Sequence__c)
      } else if (inspData[item].Category__c === "Interior") {
        category4.MATRIX_PRICE.push(inspData[item].Sub_Category__c)
        category4.SCOPE_NOTES.push(inspData[item].Scope_Notes__c)
        category4.QTY.push(inspData[item].Quantity__c)
        category4.U_M.push(inspData[item].U_M__c)
        category4.RATE.push(inspData[item].Rate__c)
        category4.TOTAL.push(inspData[item].Total__c)
        category4.KEY.push(inspData[item].UniqueKey__c)
        category4.SEQUENCE.push(inspData[item].Sequence__c)
      } else if (inspData[item].Category__c === "Mechanical, Electrical and Plumbing Systems") {
        category5.MATRIX_PRICE.push(inspData[item].Sub_Category__c)
        category5.SCOPE_NOTES.push(inspData[item].Scope_Notes__c)
        category5.QTY.push(inspData[item].Quantity__c)
        category5.U_M.push(inspData[item].U_M__c)
        category5.RATE.push(inspData[item].Rate__c)
        category5.TOTAL.push(inspData[item].Total__c)
        category5.KEY.push(inspData[item].UniqueKey__c)
        category5.SEQUENCE.push(inspData[item].Sequence__c)
      } 
      if (inspData[item].Category__c !== "Room Measurements") {
        grandTtl=grandTtl+(inspData[item].Total__c)
      }

    })
    setRoom_Measurement(room_msrmnt);
    setGeneral_Rental(category1);
    setPools(category2);
    setExterior(category3);
    setInterior(category4);
    setMech_Elec_Plumb(category5);
    setGrandTotal(grandTtl)

  }

  const setVendorFormDetails = () => {
    getVendorFormDetails(inspectionData.Id).then(data => {
      if (data.totalSize == 0) {
        setShowMsg(true)
      } else {
        GetDataByCategory(data.records);
      }
    }
    );
  }

  useEffect(() => {
    setVendorFormDetails();
  }, []);

  // useEffect(()=>{
  //   setVendorFormData(data.records)

  // },[])

  let updateLocalDataSet = (modifiedDataset, formType) => {
    vendorFormData.map(ele => {
      if (formType === "RM") {
        // console.log(modifiedDataset[0]);
        modifiedDataset.map(obj => {
          if (obj.UniqueKey__c === ele.UniqueKey__c) {
            // console.log(obj.UniqueKey__c, ele.UniqueKey__c);
          }
          return obj
        });
      }

      return ele
    })


  }

  useEffect(() => {
    // componentDidMount events
    return () => {
      console.log("unmounting");
      // componentWillUnmount events
    }
  }, []);

  const renderNoVFText = () => {
    return <InfoTextArea>
     <Text variant="InspectionHeaderName" > VENDOR FORM IS NOT AVAILABLE</Text>
    </InfoTextArea>
  }

  return (

    <>
      <StatusBar backgroundColor="red" translucent/>

      {/* <HeaderCard  >

          <SafeArea>
            <HeaderCardBody>

                        <Row>
            <Spacer position="left" size="small" />
              <View>
                <Row>
                  <Text variant="HeaderName">{inspectionData.Name} | </Text>
                  <Text variant="HeaderName">VENDOR ESTIMATE FORM</Text>
                </Row>
                <Text variant="HeaderName">{inspectionData.Property_Address__c} </Text>
              </View>
          </Row>
            </HeaderCardBody>
          </SafeArea>
      </HeaderCard> */}
      <SafeArea>
        <ScrollView >
          <HeaderCard  >
            <Spacer position="top" size="medium" />
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
              <RoomForm room_Measurement={room_MeasurementData} updateLocalData={updateLocalDataSet} />
              <Spacer position="top" size="large" />
              <OtherCategoryForms catName={"GENERAL RENTAL OPERATIONS SCOPE"} formData={general_Rental} />
              <OtherCategoryForms catName={"Pools"} formData={pools} />
              <OtherCategoryForms catName={"Exterior"} formData={exterior} />
              <OtherCategoryForms catName={"Interior"} formData={interior} />
              <OtherCategoryForms catName={"Mechanical, Electrical and Plumbing Systems"} formData={mech_Elec_Plumb} />
              <Spacer position="top" size="large" />
            <TotalContainer>
              <Text>GRAND TOTAL BID SUBMITTED : ${grandTotal.toLocaleString("en-US")}</Text>
              {/* <Text>GRAND TOTAL BID SUBMITTED : $2,265.81</Text> */}
              <Spacer position="right" size="large" />
            </TotalContainer>
          </>}
          </Body>
        </ScrollView>
      </SafeArea>
    </>
  )
}