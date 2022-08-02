import React, { useEffect, useContext } from "react";
import { View, Pressable, ScrollView, TextInput, Platform } from "react-native";
import { CollapseSectionHeader, SectionHeaderEnd, SectionContainer, FormCard, CardHeader, CardBody } from "./VendorFormPageStyles"
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from "../../../components/typography/text.component";
import { Col, Row } from "react-native-responsive-grid-system";
import { TotalContainer,TextArea, NumberInput } from "./VendorFormPageStyles";
import ContentLoader, { Rect } from 'react-content-loader/native'
import styled from "styled-components/native";




export const ApprovedItemsForm = ({ approvedItems,updateLocalData,inspId }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);
  const [length, setLength] = React.useState(false);
  const [approvedItemsData,setApprovedItemsData] = React.useState([]);



  const MyLoader = () => {
    const getRowLoader = (y) => {
      let height = Platform.isPad?30:15
      return (<>
        <ContentLoader interval="0.01" backgroundColor="#D3D3D3" style={{ height: height,flex:1 }} viewBox="0 0 600 1">
        <Rect x="1" y="0" rx="3" ry="3" width="180" height="10" />
        <Rect x="200" y="0" rx="4" ry="4" width="60" height="10" />
        <Rect x="300" y="0" rx="3" ry="3" width="60" height="10" />
        <Rect x="400" y="0" rx="3" ry="3" width="60" height="10" />
        <Rect x="500" y="0" rx="3" ry="3" width="60" height="10" />
        </ContentLoader>

        </>
      )
    }
    return <>
    {getRowLoader()}
    {getRowLoader()}
    {getRowLoader()}
    </>
  }

  const GetToalSqFt = () => {
    let toatalSF = 0;
    approvedItemsData.map(ele => {
      toatalSF = toatalSF + ele.Total
      return toatalSF
    })
    return toatalSF
  }

useEffect(()=>{
  setApprovedItemsData(approvedItems);
},[approvedItems])

const displayRows=()=>{
 return approvedItemsData.map((item, i) => {
    return (
      <Row key={item.UniqueKey}>
        <Col xs="2" md="2" style={{textAlign:"center"}}>
          <Text variant="body">{item.Category}</Text>
        </Col>
        <Col xs="2" md="2">
          <Text variant="body">{item.Sub_Category}</Text>
        </Col>
        <Col xs="2" md="2">
           <Text variant="body">{item.Approval_Status}</Text> 
        </Col>
        <Col xs="2" md="2">
           <Text variant="body">{item.Owner_Clarification  }</Text> 
        </Col>
        <Col xs="1" md="1">
          <Text variant="body">{item.Quantity}</Text>
        </Col>
        <Col xs="1" md="1">
          <Text variant="body">{item.U_M}</Text>
        </Col>
        <Col xs="1" md="1">
          <Text variant="body">{item.Rate}</Text>
        </Col>
        <Col xs="1" md="1">
          <Text variant="body">{item.Total}</Text>
        </Col>
      </Row>
    )
  })

}

  return (
    <>

        <SectionContainer>
          <FormCard>
            <CardHeader>
              <Row >
                <Col xs="2" md="2">
                  <Text  variant="formHeader">CATEGORY</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader"  >MATRIX PRICE</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader" >APPROVAL STATUS</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader" >OWNER NOTES</Text>
                </Col>
                <Col xs="1" md="1">
                  <Text variant="formHeader" >QTY</Text>
                </Col>
                <Col xs="1" md="1">
                  <Text variant="formHeader" >U/M</Text>
                </Col>
                <Col xs="1" md="1">
                  <Text variant="formHeader" >RATE</Text>
                </Col>
                <Col xs="1" md="1">
                  <Text variant="formHeader">TOTAL</Text>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {approvedItemsData.length <1 ?
                MyLoader()
                :
                displayRows(approvedItemsData)
              }
              <Row>
                <Col xs="9" md="10">
                  <TotalContainer>
                    <Text>Total Work Authorization =	</Text>
                  </TotalContainer>
                </Col>
                <Col >
                  <Text>${GetToalSqFt().toLocaleString("en-US")}</Text>
                </Col>
              </Row>
            </CardBody>
          </FormCard>
        </SectionContainer>
    </>

  )
}