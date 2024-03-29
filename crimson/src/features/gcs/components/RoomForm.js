import React, { useEffect, useContext } from "react";
import { View, Pressable, ScrollView, TextInput, Platform, TouchableOpacity } from "react-native";
import { CollapseSectionHeader, SectionHeaderEnd, SectionContainer, FormCard, CardHeader, CardBody } from "./VendorFormPageStyles"
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from "../../../components/typography/text.component";
import { Col, Row } from "react-native-responsive-grid-system";
import { TotalContainer, TextArea, NumberInput } from "./VendorFormPageStyles";
import ContentLoader, { Rect } from 'react-content-loader/native'
import styled from "styled-components/native";
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex";
import { InputBoxHolder, InputButtonWrapper, InputFieldWrapper } from "./RoomFormStyle";




export const RoomForm = ({ room_Measurement, updateLocalData, inspId, readonly }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);
  const [length, setLength] = React.useState(false);
  const [room_measurementData, setRoom_measurementData] = React.useState([]);
  const { updateVfContect } = useContext(VendorFormContext);
  const [NewItemAdded, setNewItemAdded] = React.useState(0);

  const onValueChange = async (value, field, key) => {
    {/* ////// code for adding New Line item /////  */ }
    let newState;
    if (field == "newItem") {
      let itemObject = [{
        Sub_Category: "",
        Room_Total: 0,
        Room_Misc_SF: "",
        Room_Length: 0,
        Room_Width: 0,
        UniqueKey: inspId + (room_measurementData.length + 1)
      }]
      room_measurementData.push(itemObject[0])
      newState = room_measurementData
      setNewItemAdded(NewItemAdded + 1)
    }
    else {
      newState = room_measurementData.map(obj => {
        if (obj.UniqueKey === key) {
          let newValues = { ...obj, [field]: value };
          let newTotal = (newValues.Room_Length * newValues.Room_Width) + newValues.Room_Misc_SF
          return { ...obj, [field]: value, ["Room_Total"]: newTotal };
        }
        obj.UniqueKey === key && console.log("ff");
        return obj;
      })
    }

    setRoom_measurementData(newState)
  }

  const MyLoader = () => {
    const getRowLoader = (y) => {
      let height = Platform.isPad ? 30 : 15
      return (<>
        <ContentLoader interval="0.01" backgroundColor="#D3D3D3" style={{ height: height, flex: 1 }} viewBox="0 0 600 1">
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
      toatalSF = toatalSF + ele.Room_Total
      return toatalSF
    })
    return toatalSF
  }

  {/* ////// code for adding New Line item /////  */ }
  useEffect(() => {
    updateVfContect(room_measurementData, "RM", inspId);
  }, [room_measurementData, NewItemAdded]);



  useEffect(() => {
    setRoom_measurementData(room_Measurement);
  }, [room_Measurement])




  const displayRows = () => {
    return room_measurementData.map((item, i) => {
      return (
        <Row key={item.UniqueKey}>
          <Col xs="4" md="3" style={{ textAlign: "center" }}>
            <Text variant="body">{item.Sub_Category}</Text>
          </Col>
          <Col xs="2" md="2">
            {readonly ? <Text>{item.Room_Length < 0 ? 0 : item.Room_Length == null ? 0 : item.Room_Length}</Text> :
              <InputBoxHolder>
                <InputButtonWrapper onPress={() => item.Room_Length >= 1 && onValueChange(item.Room_Length - 1, "Room_Length", item.UniqueKey)}>
                  <Text>-</Text>
                </InputButtonWrapper>
                <InputFieldWrapper >
                  <TextInput keyboardType="number-pad" multiline={true} value={`${item.Room_Length < 0 ? 0 : item.Room_Length == null ? 0 : item.Room_Length}`} onChangeText={(value) => { value >= 0 && onValueChange(Number(value), "Room_Length", item.UniqueKey) }} style={{ fontSize: 12 }} />
                </InputFieldWrapper>
                <InputButtonWrapper onPress={() => onValueChange(item.Room_Length + 1, "Room_Length", item.UniqueKey)}>
                  <Text>+</Text>
                </InputButtonWrapper>
              </InputBoxHolder>
            }
          </Col>
          <Col xs="2" md="2">
            {readonly ? <Text>{item.Room_Width < 0 ? 0 : item.Room_Width == null ? 0 : item.Room_Width}</Text> :
              <InputBoxHolder>
                <InputButtonWrapper onPress={() => item.Room_Width >= 1 && onValueChange(item.Room_Width - 1, "Room_Width", item.UniqueKey)}>
                  <Text>-</Text>
                </InputButtonWrapper>
                <InputFieldWrapper >
                  <TextInput keyboardType="number-pad" multiline={true} value={`${item.Room_Width < 0 ? 0 : item.Room_Width == null ? 0 : item.Room_Width}`} onChangeText={(value) => { value >= 0 && onValueChange(Number(value), "Room_Width", item.UniqueKey) }} style={{ fontSize: 12 }} />
                </InputFieldWrapper>
                <InputButtonWrapper onPress={() => onValueChange(item.Room_Width + 1, "Room_Width", item.UniqueKey)}>
                  <Text>+</Text>
                </InputButtonWrapper>
              </InputBoxHolder>
            }
          </Col>
          <Col xs="2" md="3">
            {readonly ? <Text>{item.Room_Misc_SF < 0 ? 0 : item.Room_Misc_SF == null ? 0 : item.Room_Misc_SF}</Text> :
              <TextArea keyboardType='numeric' defaultValue={item.Room_Misc_SF && (item.Room_Misc_SF).toString()} Value={item.Room_Misc_SF && (item.Room_Misc_SF).toString()} onChangeText={(value) => { onValueChange(parseFloat(value), "Room_Misc_SF", item.UniqueKey) }} />
            }
          </Col>
          <Col xs="2" md="2">
            <Text variant="body">{item.Room_Total}</Text>
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
                  <Text variant="formHeader">ROOM</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader" style={{ textAlign: "center" }}>LENGTH</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader" style={{ textAlign: "center" }}>WIDTH</Text>
                </Col>
                <Col xs="2" md="3">
                  <Text variant="formHeader" style={{ textAlign: "center" }}>MISC SF</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader">TOTAL</Text>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {room_measurementData.length < 1 ?
                MyLoader()
                :
                displayRows(room_measurementData)
              }
              {/* ////// code for adding New Line item /////  */}

              <Row>
                <Col>
                  <TotalContainer>
                    <Pressable onPress={() => onValueChange(null, "newItem")}><Text>+</Text></Pressable>
                  </TotalContainer>
                </Col>
              </Row>
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