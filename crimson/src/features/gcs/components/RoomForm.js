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




export const RoomForm = ({ room_Measurement, updateLocalData, inspId }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);
  const [length, setLength] = React.useState(false);
  const [room_measurementData, setRoom_measurementData] = React.useState([]);
  const { updateVfContect } = useContext(VendorFormContext);

  const onValueChange = async (value, field, key) => {
    const newState = room_measurementData.map(obj => {
      if (obj.UniqueKey === key) {
        let newValues = { ...obj, [field]: value };
        let newTotal = (newValues.Room_Length * newValues.Room_Width) + newValues.Room_Misc_SF
        return { ...obj, [field]: value, ["Room_Total"]: newTotal };
      }
      obj.UniqueKey === key && console.log("ff");
      return obj;
    });
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

  useEffect(() => {
    updateVfContect(room_measurementData, "RM", inspId);
  }, [room_measurementData]);



  useEffect(() => {
    setRoom_measurementData(room_Measurement);
  }, [room_Measurement])


 const CustomNumberInput = ({ defaultValue = 0, fieldName, uKey }) => {
    const [val, setVal] = React.useState(defaultValue);
    const handleNumberChange = (type,text=null) => {
      if (type === 'input') {
        return setVal(currVal => {
          console.log("input",text);
          if(text === undefined || currVal === null) {
            text = 0;
          }
          onValueChange(text, fieldName, uKey);
          return text
        })
      }
      if (type === "add") {

        return setVal(currVal => {
          console.log("Add",currVal);
          if(currVal === undefined || currVal === null) {
            currVal = 0;
          }
          onValueChange(currVal + 1, fieldName, uKey);
          return currVal + 1
        })

      }
      return setVal(currVal => {
        console.log("subtract",currVal);
        if(currVal === 0 || currVal === undefined || currVal === null) {
          return ;
        }
        onValueChange(currVal - 1, fieldName, uKey);
        return currVal - 1
      })
    }

    const wrapperStyle = {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#fff0f0',
      borderRadius:8,
      width: Platform.isPad ? 115 : 60,
      height: Platform.isPad ? 40 : 30,
    }

    const valStyle = {
      width: 18,
      height: 29,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex:1,
    }

    const btnStyle = {
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#a3dfa0"
    }

    return (
      <View style={wrapperStyle} >
        <TouchableOpacity style={btnStyle} onPress={() => handleNumberChange("subtract")}>
          <Text>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={valStyle}>
          {/* <Text style={{ fontSize: 12 }} >
            {val}
          </Text> */}
          <TextInput keyboardType="number-pad" style={{ fontSize: 12 }} value={`${val}`} onChangeText={(text) => handleNumberChange("input",Number(text))} />
        </TouchableOpacity>
        <TouchableOpacity style={btnStyle} onPress={() => handleNumberChange("add")}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    )
  }


  const displayRows = () => {
    return room_measurementData.map((item, i) => {
      return (
        <Row key={item.UniqueKey}>
          <Col xs="4" md="3" style={{ textAlign: "center" }}>
            <Text variant="body">{item.Sub_Category}</Text>
          </Col>
          <Col xs="2" md="2">
            <CustomNumberInput defaultValue={item.Room_Length} fieldName="Room_Length" uKey={item.UniqueKey} />
            {/* <NumberInput value={item.Room_Length} id="3" onChange={(value) => { onValueChange(value, "Room_Length", item.UniqueKey) }} /> */}
            {/* <Text variant="body">{room_Measurement.LENGTH[item]}</Text> */}
          </Col>
          <Col xs="2" md="2">
          <CustomNumberInput defaultValue={item.Room_Width} fieldName="Room_Width" uKey={item.UniqueKey} />
            {/* <NumberInput value={item.Room_Width} onChange={(value) => { onValueChange(value, "Room_Width", item.UniqueKey) }} /> */}
            {/* <Text variant="body">{room_Measurement.WIDTH[item]}</Text> */}
          </Col>
          <Col xs="2" md="3">
            {/* <Text variant="body">{item.Room_Misc_SF}</Text> */}
            <TextArea keyboardType='numeric' defaultValue={item.Room_Misc_SF && (item.Room_Misc_SF).toString()} Value={item.Room_Misc_SF && (item.Room_Misc_SF).toString()} onChangeText={(value) => { onValueChange(parseFloat(value), "Room_Misc_SF", item.UniqueKey) }} />
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