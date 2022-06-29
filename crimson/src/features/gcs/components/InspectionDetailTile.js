import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Collapsible from 'react-native-collapsible';
import { Text } from "../../../components/typography/text.component";
import styled from "styled-components"
import { CollapseSectionHeader, SectionHeaderEnd, InspectionDetails, SectionContainer } from "./InspectionDetailTileStyle";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Col, Row } from "react-native-responsive-grid-system";


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
  Inspection_Scheduled_Date__c:"INSPECTION SCHEDULED DATE",
  Target_Rehab_Complete_Date__c:"TARGET REHAB COMPLETE DATE"
};


export const InspectionDetailTile = ({ inspectionData }) => {
  const [isCloseProperty, setCloseProperty] = React.useState(true);
  const [isCloseAccess_Info, setCloseAccess_Info] = React.useState(true);
  const [isCloseKey_Date, setCloseKey_Date] = React.useState(true);
  const handlePress = (setIsCollapsed,isCollapsed) => setIsCollapsed(!isCollapsed);
  // let inspectionData=inspectionData



  const getDetailDrawer = (headerName,dataList,isCollapsed,setIsCollapsed) => {
    return (  
      <>
        <Pressable onPress={()=>handlePress(setIsCollapsed,isCollapsed)}>

          <CollapseSectionHeader>
            <Text>{headerName}</Text>

            <SectionHeaderEnd>

              {isCollapsed ? <Icon name="keyboard-arrow-down" size={30} color="black" />
                : <Icon name="keyboard-arrow-up" size={30} color="black" />}
            </SectionHeaderEnd>
          </CollapseSectionHeader>
        </Pressable>
        <Collapsible collapsed={isCollapsed} >
          <SectionContainer>
            {Object.keys(dataList).map((item, i) => {
              return (
                <Row key={inspectionData[item].concat(i)}>
                  <Col xs={4}>
                    <Text variant="CarContentList">{dataList[item]} : </Text>
                  </Col>
                  <Col>
                    <Text variant="cardValue">{inspectionData[item]?inspectionData[item]:'NA'}</Text>
                  </Col>
                </Row>)
            })}


          </SectionContainer>
        </Collapsible>
      </>

    )

  }




  return (
    <>
      <InspectionDetails>
      {getDetailDrawer("PROPERTY DETAILS",propertyDetails,isCloseProperty,setCloseProperty)}
      {getDetailDrawer("KEY CONTACTS AND ACCESS INFORMATION",Key_Contact_Access_Info,isCloseAccess_Info, setCloseAccess_Info)}
      {getDetailDrawer("KEY DATE",Key_Date,isCloseKey_Date, setCloseKey_Date)}
      </InspectionDetails>
    

    </>
  )
}