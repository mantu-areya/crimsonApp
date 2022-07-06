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
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex";





export const RoomForm = ({ room_Measurement,updateLocalData }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);
  const [length, setLength] = React.useState(false);
  const [room_measurementData,setRoom_measurementData] = React.useState([]);
  const { vendorFormDetails, addToVfContex } = useContext(VendorFormContext);

  const onValueChange = async (value,field,key)=>{
    const newState = room_measurementData.map(obj => {
      if (obj.UniqueKey__c===key) {
        return {...obj, [field]: value};
      }
      return obj;
    });
    setRoom_measurementData(newState)


  }

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
    room_measurementData.map(ele => {
      toatalSF = toatalSF + ele.Room_Total__c
      return toatalSF
    })
    return toatalSF
  }

  // useEffect(() => {
  //   // componentDidMount events
  //   return () => {
  //     console.log("unmounting from Room mes");
  //     updateLocalData(room_measurementData,"RM");
  //     // componentWillUnmount events
  //   }
  // }, []);


useEffect(()=>{
  setRoom_measurementData(room_Measurement);
},[room_Measurement])


const displayRows=()=>{
 return room_measurementData.map((item, i) => {
    return (
      <Row key={item.UniqueKey__c}>
        <Col xs="4" md="3" style={{textAlign:"center"}}>
          <Text variant="body">{item.Sub_Category__c}</Text>
        </Col>
        <Col xs="2" md="2">
          <NumberInput  value={item.Room_Length__c} id="3" onChange={(value) =>{onValueChange(value,"Room_Length__c",item.UniqueKey__c)}} />
          {/* <Text variant="body">{room_Measurement.LENGTH[item]}</Text> */}
        </Col>
        <Col xs="2" md="2">
          <NumberInput value={item.Room_Width__c} onChange={(value) =>{onValueChange(value,"Room_Width__c",item.UniqueKey__c)}} />
          {/* <Text variant="body">{room_Measurement.WIDTH[item]}</Text> */}
        </Col>
        <Col xs="2" md="3">
          {/* <Text variant="body">{room_Measurement.MISC_SF[item]}</Text> */}
          <TextArea Value={item.Room_Misc_SF__c}  onChangeText={(value) =>{onValueChange(value,"Room_Misc_SF__c",item.UniqueKey__c)}}/>
        </Col>
        <Col xs="2" md="2">
          <Text variant="body">{item.Room_Total__c}</Text>

        </Col>
      </Row>
    )
  })

}



  return (
    <>
      <Pressable onPress={() => handlePress(setIsCollapsed, isCollapsed)}>
        <CollapseSectionHeader>
          <Row>
            <Col xs="7" md="8">
              <Row>
                <Text>ROOM MEASUREMENTS</Text>
                {isCollapsed ? <Icon name="keyboard-arrow-down" size={30} color="black" />
                  : <Icon name="keyboard-arrow-up" size={30} color="black" />}
              </Row>
            </Col>
            <Col>
            <Text>TOTAL SQ.FT. :{GetToalSqFt().toLocaleString("en-US")}</Text>
            </Col></Row>
        </CollapseSectionHeader>
      </Pressable>
      <Collapsible collapsed={isCollapsed} >
        <SectionContainer>
          <FormCard>
            <CardHeader>
              <Row >
                <Col xs="4" md="3">
                  <Text  variant="formHeader">ROOM</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader"  style={{textAlign:"center"}}>LENGTH</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader" style={{textAlign:"center"}}>WIDTH</Text>
                </Col>
                <Col xs="2" md="3">
                  <Text variant="formHeader" style={{textAlign:"center"}}>MISC SF</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader">TOTAL</Text>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {room_measurementData.length <1 ?
                MyLoader()
                :
                displayRows(room_measurementData)
              }
              <Row>
                <Col xs="9" md="10">
                  <TotalContainer>
                    <Text>TOTAL SQ.FT.</Text>
                  </TotalContainer>
                </Col>
                <Col >
                  <Text>{GetToalSqFt().toLocaleString("en-US")}</Text>
                </Col>
              </Row>
            </CardBody>
          </FormCard>
        </SectionContainer>
      </Collapsible >
    </>

  )
}