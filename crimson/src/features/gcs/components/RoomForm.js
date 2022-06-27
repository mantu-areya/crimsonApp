import React, { useEffect } from "react";
import { View, Pressable, ScrollView,TextInput } from "react-native";
import { CollapseSectionHeader, SectionHeaderEnd, SectionContainer, FormCard, CardHeader, CardBody } from "./VendorFormPageStyles"
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from "../../../components/typography/text.component";
import { Col, Row } from "react-native-responsive-grid-system";
import { Spacer, SpacerView } from "../../../components/spacer/spacer.component";
import { TotalContainer } from "./VendorFormPageStyles";
import ContentLoader, { Rect } from 'react-content-loader/native'
import NumericInput from 'react-native-numeric-input'
import styled from "styled-components/native";


const NumberInput = styled(NumericInput).attrs({
  // type:'up-down' ,
  totalWidth:55,
  totalHeight:25,
  rounded:true,
  rightButtonBackgroundColor:"#a3dfa0",
  leftButtonBackgroundColor	:"#a3dfa0"
})`
`;

export const RoomForm = ({ room_Measurement }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);


  const changeAmount = (value)=>{
      console.log(value);
  }

  const MyLoader = () => {
    return (
      <ContentLoader interval="0.01" backgroundColor="#D3D3D3" style={{ height: 100 }} viewBox="0 14 490 60">
        {/* <Rect x="0" y="0" rx="5" ry="5" width="70" height="70" /> */}
        <Rect x="0" y="8" rx="3" ry="3" width="80" height="13" />
        <Rect x="110" y="8" rx="4" ry="4" width="70" height="13" />
        <Rect x="190" y="8" rx="3" ry="3" width="70" height="13" />
        <Rect x="280" y="8" rx="3" ry="3" width="70" height="13" />
        <Rect x="380" y="8" rx="3" ry="3" width="70" height="13" />
        <Rect x="0" y="35" rx="3" ry="3" width="80" height="13" />
        <Rect x="110" y="35" rx="4" ry="4" width="70" height="13" />
        <Rect x="190" y="35" rx="3" ry="3" width="70" height="13" />
        <Rect x="280" y="35" rx="3" ry="3" width="70" height="13" />
        <Rect x="380" y="35" rx="3" ry="3" width="70" height="13" />
        <Rect x="0" y="65" rx="3" ry="3" width="80" height="13" />
        <Rect x="110" y="65" rx="4" ry="4" width="70" height="13" />
        <Rect x="190" y="65" rx="3" ry="3" width="70" height="13" />
        <Rect x="280" y="65" rx="3" ry="3" width="70" height="13" />
        <Rect x="380" y="65" rx="3" ry="3" width="70" height="13" />




      </ContentLoader>)
  }

  const GetToalSqFt = () => {
    let toatalSF = 0;
    Object.keys(room_Measurement.TOTAL).map(ele => {
      toatalSF = toatalSF + room_Measurement.TOTAL[ele]
      return toatalSF
    })
    return toatalSF
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
            <Col><Text>TOTAL SQ.FT. :{GetToalSqFt().toLocaleString("en-US")}</Text>
            </Col></Row>
        </CollapseSectionHeader>
      </Pressable>
      <Collapsible collapsed={isCollapsed} >
        <SectionContainer>
          <FormCard>
            <CardHeader>
              <Row >
                <Col xs="3" md="4">
                  <Text variant="label">ROOM</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">LENGTH</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">WIDTH</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">MISC SF</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">TOTAL</Text>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {room_Measurement.ROOM.length == 0 ?
                MyLoader()
                :
                Object.keys(room_Measurement.ROOM).map((item, i) => {
                  return (
                    <Row key={i}>

                      <Col xs="3" md="4">
                        <Text variant="body">{room_Measurement.ROOM[item]}</Text>
                      </Col>
                      <Col xs="2" md="2">
                      <NumberInput  value={room_Measurement.LENGTH[item]} onChange={value => changeAmount(value)} />
                        <Text variant="body">{room_Measurement.LENGTH[item]}</Text>
                      </Col>
                      <Col xs="2" md="2">
                      <NumberInput  value={room_Measurement.WIDTH[item]} onChange={value => console.log(value)} />
                        {/* <Text variant="body">{room_Measurement.WIDTH[item]}</Text> */}
                      </Col>
                      <Col xs="2" md="2">
                        {/* <Text variant="body">{room_Measurement.MISC_SF[item]}</Text> */}
                        <NumberInput  value={room_Measurement.MISC_SF[item]} onChange={value => changeAmount(value)} />

                      </Col>
                      <Col xs="2" md="2">
                        <Text variant="body">{room_Measurement.TOTAL[item]}</Text>
 
                      </Col>
                    </Row>
                  )
                })
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