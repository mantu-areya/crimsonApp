import React, { useEffect } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { CollapseSectionHeader, SectionHeaderEnd, SectionContainer, FormCard, CardHeader, CardBody } from "./VendorFormPageStyles"
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from "../../../components/typography/text.component";
import { Col, Row } from "react-native-responsive-grid-system";
import { Spacer } from "../../../components/spacer/spacer.component";
import { TotalContainer } from "./VendorFormPageStyles";
import ContentLoader, { Rect }from 'react-content-loader/native'


export const OtherCategoryForms = ({ catName, dataList }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);

  const MyLoader = () => {
    return(
    <ContentLoader interval="0.01" backgroundColor="#D3D3D3"  style={{height:100}} viewBox="0 14 490 60">
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

  const GetToal=()=>{
    let toatalSF=0;
    Object.keys(dataList.TOTAL).map(ele=>{
      toatalSF=toatalSF+dataList.TOTAL[ele]
      return toatalSF
    })
   return  toatalSF
  }

  return (
    <>
      <Pressable onPress={() => handlePress(setIsCollapsed, isCollapsed)}>
        {/* 
        <CollapseSectionHeader>
          <Text>{catName}</Text>
          {isCollapsed ? <Icon name="keyboard-arrow-down" size={30} color="black" />
            : <Icon name="keyboard-arrow-up" size={30} color="black" />}
        </CollapseSectionHeader> */}




        <CollapseSectionHeader>
          <Row>
            <Col xs="9" md="10">
              <Row>
                <Text>{catName}</Text>
                {isCollapsed ? <Icon name="keyboard-arrow-down" size={30} color="black" />
                  : <Icon name="keyboard-arrow-up" size={30} color="black" />}
              </Row>
            </Col>
            <Col xs="3" md="2">
              <TotalContainer>
                {/* <Text>TOTAL :${GetToal().toLocaleString("en-US")}</Text> */}
                <Text>TOTAL :$2,225</Text>
              </TotalContainer>
            </Col>
          </Row>
        </CollapseSectionHeader>

      </Pressable>
      <Collapsible collapsed={isCollapsed} >
        <SectionContainer>
          <FormCard>
            <CardHeader>
              <Row >
                <Col xs="2" md="2">
                  <Text variant="label">MATRIX PRICE</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">SCOPE NOTES</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">QTY.</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">U/M</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">RATE</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="label">TOTAL</Text>
                </Col>
              </Row>
            </CardHeader>

            <CardBody>
            {dataList.MATRIX_PRICE.length==0?
            MyLoader()
            :
              Object.keys(dataList.MATRIX_PRICE).map((item, i) => {
                return (

                  <Row key={i}>

                    <Col xs="2" md="2">
                      <Text variant="body">{dataList.MATRIX_PRICE[i]}</Text>
                    </Col>
                    <Col xs="2" md="2">
                      <Text variant="body">{dataList.SCOPE_NOTES[i]}</Text>
                    </Col>
                    <Col xs="2" md="2">
                      <Text variant="body">{dataList.QTY[i]}</Text>
                    </Col>
                    <Col xs="2" md="2">
                      <Text variant="body">{dataList.U_M[i]}</Text>
                    </Col>
                    <Col xs="2" md="2">
                      <Text variant="body">{dataList.RATE[i]}</Text>
                    </Col>
                    <Col xs="2" md="2">
                      <Text variant="body">{dataList.TOTAL[i]}</Text>
                    </Col>
                  </Row>
                )
              })}
            </CardBody>
          </FormCard>
        </SectionContainer>
      </Collapsible>
    </>

  )
}