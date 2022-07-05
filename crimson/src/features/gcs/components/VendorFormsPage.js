
import React, { useEffect, useState, useContext } from "react";
// import { Row } from "../components/ProcessRecordsInfoCardStyle";
import { Image, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Row, Col } from 'react-native-responsive-grid-system';
import { Dimensions } from 'react-native';
import { InspectionDetailTile } from "./InspectionDetailTile";
import { RoomForm } from "./RoomForm";
import { OtherCategoryForms } from "./OtherCategoryForms";
import { TotalContainer, InfoTextArea, ActionContainer, HeaderCardCover, HeaderCardBody, HeaderCard, Body } from "./VendorFormPageStyles";
import { ActivityIndicator, Colors } from "react-native-paper";
import { InspectionDetailsCard } from "./InspectionDetailsCard"
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex";









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
  const { vendorFormDetails, addToVfContex } = useContext(VendorFormContext);



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
    // addToVfContex(inspData)


  }



  useEffect(() => {
    if (vendorFormDetails[inspectionData.Id]){
      if( vendorFormDetails[inspectionData.Id].totalSize == 0) {
      setShowMsg(true)
    } else {
      console.log(vendorFormDetails,"trc");

      const records = vendorFormDetails[inspectionData.Id].records;

      GetDataByCategory(records);
    }
  }
  }, [vendorFormDetails]);

  let updateLocalDataSet = (modifiedDataset, formType) => {
    vendorFormData.map(ele => {
      if (formType === "RM") {
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

  // useEffect(() => {
  //   // componentDidMount events
  //   return () => {
  //     console.log("unmounting");
  //     // componentWillUnmount events
  //   }
  // }, []);

  const renderNoVFText = () => {
    return <InfoTextArea>
      <Text variant="InspectionHeaderName" > VENDOR FORM IS NOT AVAILABLE</Text>
    </InfoTextArea>
  }

  return (

    <>

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