import React, { useEffect } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { CollapseSectionHeader, SectionHeaderEnd, SectionContainer, FormCard, CardHeader, CardBody } from "./VendorFormPageStyles"
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from "../../../components/typography/text.component";
import { Col, Row } from "react-native-responsive-grid-system";
import { Spacer } from "../../../components/spacer/spacer.component";
import { TotalContainer, NumberInput, TextArea} from "./VendorFormPageStyles";
import ContentLoader, { Rect }from 'react-content-loader/native'
import { Platform } from 'react-native';


export const OtherCategoryForms = ({ catName, dataList }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);

  const MyLoader = () => {
    let height = Platform.isPad?30:15
    const getRowLoader = (y) => {
      return (<>
        <ContentLoader interval="0.01" backgroundColor="#D3D3D3" style={{ height: height,flex:1 }} viewBox="0 0 600 1">
        <Rect x="1" y="0" rx="3" ry="3" width="80" height="10" />
        <Rect x="100" y={y} rx="4" ry="4" width="80" height="10" />
        <Rect x="200" y={y} rx="3" ry="3" width="60" height="10" />
        <Rect x="300" y={y} rx="3" ry="3" width="60" height="10" />
        <Rect x="400" y={y} rx="3" ry="3" width="60" height="10" />
        <Rect x="500" y={y} rx="3" ry="3" width="60" height="10" />

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
                <Text>TOTAL :${GetToal().toLocaleString("en-US")}</Text>
                {/* <Text>TOTAL :$2,225</Text> */}
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
                  <Text variant="formHeader">MATRIX PRICE</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader">SCOPE NOTES</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader">QTY.</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader">U/M</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader">RATE</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader">TOTAL</Text>
                </Col>
              </Row>
            </CardHeader>

            <CardBody>
            {dataList.MATRIX_PRICE.length==0?
            MyLoader() 
            :
              Object.keys(dataList.MATRIX_PRICE).map((item, i) => {
                return (

                  <Row key={dataList.MATRIX_PRICE[i].concat(i)}>

                    <Col xs="2" md="2">
                      <Text variant="body">{dataList.MATRIX_PRICE[i]}</Text>
                    </Col>
                    <Col xs="2" md="2">
                    <TextArea Value={dataList.SCOPE_NOTES[i]}/>
                    </Col>
                    <Col xs="2" md="2">
                    <NumberInput value={dataList.QTY[i]} onChange={()=>{}} />
                    </Col>
                    <Col xs="2" md="2">
                    <TextArea Value={dataList.U_M[i]}/>
                    </Col>
                    <Col xs="2" md="2">
                    <NumberInput value={dataList.RATE[i]} onChange={()=>{}} />
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