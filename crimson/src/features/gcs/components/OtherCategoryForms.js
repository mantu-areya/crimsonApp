import React, { useEffect,useContext, useRef } from "react";
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
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex";


export const OtherCategoryForms = ({ catName, formData, inspId }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isNotesCollapsed, setIsNotesCollapsed] = React.useState(false);
  const key = useRef('');
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);
  const handleNotes = (isNotesCollapsed, setIsNotesCollapsed, rowKey) => {
    key.current=rowKey
    if ( key.current==''||key.current == rowKey)
      return setIsNotesCollapsed(!isNotesCollapsed)
  };
  let [dataList, setDatalist] = React.useState([])
  const {  updateVfContect } = useContext(VendorFormContext);

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
      toatalSF = toatalSF + ele.Total
      return toatalSF
    })
    return toatalSF
  }

  const onValueChange = async (value,field,key)=>{
    const newState = dataList.map(obj => {
      if (obj.UniqueKey===key) {
        return {...obj, [field]: value};
      }
      return obj;
    });
    setDatalist(newState)
  }
  const displayRows=(dataList)=>{
    return dataList.map((item, i) => {
      return (
        <View key={item.UniqueKey}>
          <Row >

            <Col xs="3" md="3">
              <Text variant="body">{item.Sub_Category}</Text>
            </Col>

            <Col xs="3" md="3">
              <NumberInput value={item.Quantity} onChange={(value) =>{onValueChange(value,"Quantity",item.UniqueKey)}} />
            </Col>
            <Col xs="3" md="3">
              <NumberInput value={item.Rate} onChange={(value) =>{onValueChange(value,"Rate",item.UniqueKey)}} />
            </Col>
            <Col xs="2" md="2">
              <Text variant="body">{item.Total}</Text>
            </Col>
            <Col>
                <PressableIcon onPress={() => handleNotes(isNotesCollapsed, setIsNotesCollapsed, item.UniqueKey)}>
              {(isNotesCollapsed && item.UniqueKey === key.current)? <Icon name="close" size={25} color="black"  />
                : <NoteIcon name="note" size={20} color="black" />}
           </PressableIcon>
            </Col>
          </Row>
          <Collapsible collapsed={!(isNotesCollapsed && item.UniqueKey === key.current)} >
            <ExpandSection>
            <Text variant="formHeader">SCOPE NOTES :</Text>
              <OtherFormTextArea Value={item.Scope_Notes} onChange={(value) =>{onValueChange(value,"Scope_Notes",item.UniqueKey)}} />
              <Text variant="formHeader">U/M :</Text>
              <OtherFormTextArea Value={item.U_M} onChange={(value) =>{onValueChange(value,"U_M",item.UniqueKey)}}/>
            </ExpandSection>
          </Collapsible>
          <Spacer position="top" size="medium" />

        </View>
      )
    })
  }

  useEffect(() => {
      updateVfContect(dataList,"OTHRFM",inspId);
  }, [dataList]);

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