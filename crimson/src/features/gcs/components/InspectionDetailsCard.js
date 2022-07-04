import react from 'react';
import { View, ImageBackground } from "react-native"
import { Card } from 'react-native-paper';
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Col, Row } from 'react-native-responsive-grid-system';
import { Spacer } from '../../../components/spacer/spacer.component';
import { Text } from '../../../components/typography/text.component';








const CardConatainer = styled.View`

`;




export const InspectionDetailsCard = ({ inspectionData }) => {

  const propertyDetails = {
    Property_Address__c: "PROPERTY ADDRESS",
    Property_City__c: "PROPERTY CITY",
    Property_State__c: "PROPERTY STATE",
    Property_Zip_Code__c: "PROPERTY ZIP CODE"
  }

  const Key_Contact_Access_Info = {
    General_Contractor__c: "GENERAL CONTRACTOR",
    HHM_Field_PM__c: "HHM FIELD PM",
    Repair_Estimator__c: "REPAIR ESTIMATOR",
    Property_Zip_Code__c: "PROPERTY ZIP CODE"
  }

  const Key_Date = {
    Inspection_Scheduled_Date__c: "INSPECTION SCHEDULED DATE",
    Target_Rehab_Complete_Date__c: "TARGET REHAB COMPLETE DATE"
  };


  const getDetailDrawer = (headerName, dataList, icon) => {
    return (
      <>

        <Row >
          <Icon name={icon} size={30} color="white" />
          <Spacer position="right" size="small"/>
          <Col xs="10">
          <Text variant="DetailcardHeader" >{headerName}</Text>
            <Spacer position="bottom" size="small"/>

            <Row >
            {Object.keys(dataList).map((item, i) => {
              return (
              <View key={dataList[item].concat(i)}>
              <Spacer  position="right" size="large">
                    <Text variant="VfDetailsKey" >{dataList[item]} : </Text>
                    <Text variant="VfDetailsValue">{inspectionData[item]?inspectionData[item]:'NA'}</Text>
                    <Spacer position="bottom" size="small"/>

                    </Spacer>
                    </View>
                )
            })}
            </Row>
          </Col>
        </Row>




      </>

    )

  }







  return <>
    <CardConatainer >
        {getDetailDrawer("PROPERTY DETAILS", propertyDetails,"office-building-marker")}
        <Spacer position="top" size="medium" />
        {getDetailDrawer("KEY CONTACTS AND ACCESS INFORMATION", Key_Contact_Access_Info,"folder-key")}
        {getDetailDrawer("KEY DATE",Key_Date,"calendar-month")}


    </CardConatainer>
  </>
}