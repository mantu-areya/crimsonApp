import React, { useEffect } from "react";
import { View, ScrollView,Pressable } from "react-native";
import { CollapseSectionHeader, SectionHeaderEnd, SectionContainer, FormCard, CardHeader, CardBody, CardRow } from "./VendorFormPageStyles"
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NoteIcon from 'react-native-vector-icons/SimpleLineIcons';
import { Text } from "../../../components/typography/text.component";
import { Col, Row } from "react-native-responsive-grid-system";
import { Spacer, SpacerView } from "../../../components/spacer/spacer.component";
import { TotalContainer, NumberInput, TextArea, ExpandSection, OtherFormTextArea,PressableIcon } from "./VendorFormPageStyles";
import ContentLoader, { Rect } from 'react-content-loader/native'
import { Platform } from 'react-native';


export const OtherCategoryForms = ({ catName, formData }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isNotesCollapsed, setIsNotesCollapsed] = React.useState(false);
  const [key, setKey] = React.useState('');
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);
  const handleNotes = (isNotesCollapsed, setIsNotesCollapsed, rowKey) => {
    setKey(rowKey)
    if (key == '' || key === rowKey)
      return setIsNotesCollapsed(!isNotesCollapsed)
  };
  let [dataList, setDatalist] = React.useState([])


  const MyLoader = () => {
    let height = Platform.isPad ? 30 : 15
    const getRowLoader = (y) => {
      return (<>
        <ContentLoader interval="0.01" backgroundColor="#D3D3D3" style={{ height: height, flex: 1 }} viewBox="0 0 600 1">
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

  const GetToal = () => {
    let toatalSF = 0;
    dataList.map(ele => {
      toatalSF = toatalSF + ele.Total__c
      return toatalSF
    })
    return toatalSF
  }

  const onValueChange = async (value,field,key)=>{
    const newState = dataList.map(obj => {
      if (obj.UniqueKey__c===key) {
        return {...obj, [field]: value};
      }
      return obj;
    });
    setDatalist(newState)
  }
  const displayRows=(dataList)=>{
    return dataList.map((item, i) => {
      return (
        <View key={item.UniqueKey__c}>
          <Row >

            <Col xs="3" md="3">
              <Text variant="body">{item.Sub_Category__c}</Text>
            </Col>

            <Col xs="3" md="3">
              <NumberInput value={item.Quantity__c} onChange={(value) =>{onValueChange(value,"Quantity__c",item.UniqueKey__c)}} />
            </Col>
            {/* <Col xs="2" md="2">
        <TextArea Value={item.U_M__c}/>
        </Col> */}
            <Col xs="3" md="3">
              <NumberInput value={item.Rate__c} onChange={(value) =>{onValueChange(value,"Rate__c",item.UniqueKey__c)}} />
            </Col>
            <Col xs="2" md="2">
              <Text variant="body">{item.Total__c}</Text>
            </Col>
            <Col>
                <PressableIcon onPress={() => handleNotes(isNotesCollapsed, setIsNotesCollapsed, item.UniqueKey__c)}>
              {(isNotesCollapsed && item.UniqueKey__c === key) ? <Icon name="close" size={25} color="black"  />
                : <NoteIcon name="note" size={20} color="black" />}
           </PressableIcon>
            </Col>
          </Row>
          <Collapsible collapsed={!(isNotesCollapsed && item.UniqueKey__c === key)} >
            <ExpandSection>
            <Text variant="formHeader">SCOPE NOTES :</Text>
              <OtherFormTextArea Value={item.Scope_Notes__c} />
              <Text variant="formHeader">U/M :</Text>
              <OtherFormTextArea Value={item.U_M__c}/>
            </ExpandSection>
          </Collapsible>
          <Spacer position="top" size="medium" />

        </View>
      )
    })
  }
  useEffect(() => {
    setDatalist(formData);
  }, [formData])

  useEffect(() => {

  }, [key])

  return (
    <>
      <Pressable onPress={() => handlePress(setIsCollapsed, isCollapsed)}>

        <CollapseSectionHeader>
          <Row>
            <Col xs="8" md="10">
              <Row>
                <Text>{catName}</Text>
                {isCollapsed ? <Icon name="keyboard-arrow-down" size={30} color="black" />
                  : <Icon name="keyboard-arrow-up" size={30} color="black" />}
              </Row>
            </Col>
            <Col xs="4" md="2">
              <TotalContainer>
                <Text>TOTAL : ${GetToal().toLocaleString("en-US")}</Text>
                {/* <Text>TOTAL :$2,225</Text> */}
              </TotalContainer>
            </Col>
          </Row>
        </CollapseSectionHeader>

      </Pressable>
      <Spacer position="top" size="large" />

      <Collapsible collapsed={isCollapsed} >
        <SectionContainer>
          <FormCard>
            <CardHeader>
              <Row >
                <Col xs="3" md="3">
                  <Text variant="formHeader">MATRIX PRICE</Text>
                </Col>
                {/* <Col xs="2" md="2">
                  <Text variant="formHeader">SCOPE NOTES</Text>
                </Col> */}
                <Col xs="3" md="3">
                  <Text variant="formHeader">QTY.</Text>
                </Col>
                {/* <Col xs="2" md="2">
                  <Text variant="formHeader">U/M</Text>
                </Col> */}
                <Col xs="3" md="3">
                  <Text variant="formHeader">RATE</Text>
                </Col>
                <Col xs="2" md="2">
                  <Text variant="formHeader">TOTAL</Text>
                </Col>
              </Row>
            </CardHeader>

            <CardBody>
              {dataList.length == 0 ?
                MyLoader()
                :displayRows(dataList)
                }
            </CardBody>
          </FormCard>
        </SectionContainer>
      </Collapsible>
    </>

  )
}