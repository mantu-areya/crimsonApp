import React, { useEffect, useState } from "react";
import { ExpandSection, CheckListbox, Header, InputField, ErrorBanner, RequireMarkText } from "./SubmitReviewFormStyle"
import { Row, Col } from 'react-native-responsive-grid-system';
import { Text } from "../../../components/typography/text.component";
import { Image, Platform, Pressable, View, } from 'react-native'
import { Spacer } from "../../../components/spacer/spacer.component";
import { updateSfVendorFormDetails } from "../../../services/inspections/inspections.service";
import { Button } from "react-native-paper";
import Dropdown from '../../../utilities/DropDown';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import KeyboardSpacer from 'react-native-keyboard-spacer';



export const SubmitReviewForm = ({ handleCloseModal, setreadonly, inspVfDetails, inspId, navigation, setIsNotesCollapsed }) => {

  const [checkList, setCheckList] = useState(checkListObj)
  const [textObj, setTextObj] = useState({ "Electric Meter #": '', "Water Meter #": '', "Gas Meter #": '', "Utility Notes": '' })
  const [selectListObject, setSelectListObj] = useState({ "Electric On": '', "Water On": '', "Gas On": '', "Septic": '', "Well": '', "Propane": '', "Oil": '' })
  const [errorState, setErrorState] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState('');
  const [errorFields, setErrorFields] = useState('')

  const data = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];


  const handleIsChacked = (label, selecteditem, value) => {
    checkList && Object.keys(checkList).map(ele => {
      ele == label && Object.keys(checkList[ele]).map(item => {
        if (item == selecteditem) {
          (checkList[ele][item] = !value)
        }
      })
    });
    setCheckList({ ...checkList })
  }



  const checkListObj = {
    "Electric": {
      City: '',
      Solar: '',
      Local: ''
    },
    Water: {
      City: '',
      Well: '',
      Local: ''

    },
    "Gas/Fuel Tank": {
      "Not Applicable": '',
      "Natural Gas": '',
      "Propane Tank": '',
      Local: ''
    },
    Sewer: {
      City: '',
      Septic: '',
    },

  }



  const handleTextChange = (item, value) => {
    textObj && Object.keys(textObj).map(ele => {
      if (ele == item) {
        textObj[ele] = value
      }
    })
    setTextObj({ ...textObj })
  }

  useEffect(() => {
    setCheckList(checkListObj)
  }, [])


  const handleSelectChange = (item, value) => {
    selectListObject && Object.keys(selectListObject).map(data => {
      data == item && setSelectListObj({ ...selectListObject, [data]: value })
      return
    })
  }

  const HnadleSubmitUtility = () => {

    setIsSubmitting(true);

    let electric, electric_meter, electric_on, water, water_meter, water_on, gas_fuel_tank, gas_meter, gas_on, sewer, septic, well, utility_notes, propane, oil = ""
    checkList && Object.keys(checkList).map(ele => {
      Object.keys(checkList[ele]).map(item => {
        if (ele == "Electric") {
          checkList[ele][item] != '' && (electric ? electric += (electric == '' ? item : ";" + item) : electric = item)
        }
        else if (ele == "Water") {
          checkList[ele][item] != '' && (water ? water += (water == '' ? item : ";" + item) : water = item)
        }
        else if (ele == "Gas/Fuel Tank") {
          checkList[ele][item] != '' && (gas_fuel_tank ? gas_fuel_tank += (gas_fuel_tank == '' ? item : ";" + item) : gas_fuel_tank = item)
        }
        else if (ele == "Sewer") {
          checkList[ele][item] != '' && (sewer ? sewer += (sewer == '' ? item : ";" + item) : sewer = item)
        }
      })
    })


    let tempObject = {
      electric: electric ? electric : "",
      electric_meter: textObj && textObj["Electric Meter #"],
      electric_on: selectListObject && selectListObject["Electric On"],
      water: water ? water : "",
      water_meter: textObj && textObj["Water Meter #"],
      water_on: selectListObject && selectListObject["Water On"],
      gas_fuel_tank: gas_fuel_tank ? gas_fuel_tank : "",
      gas_meter: textObj && textObj["Gas Meter #"],
      gas_on: selectListObject && selectListObject["Gas On"],
      sewer: sewer ? sewer : "",
      septic: selectListObject && selectListObject["Septic"],
      well: selectListObject && selectListObject["Well"],
      utility_notes: textObj && textObj["Utility Notes"],
      propane: selectListObject && selectListObject["Propane"],
      oil: selectListObject && selectListObject["Oil"],
    }

    let hasNoError
    let requiredFields = ["electric", "water", "gas_fuel_tank", "sewer", electric && "electric_meter", water && water.split(";").includes("City") && "water_meter", gas_fuel_tank && gas_fuel_tank.split(";").includes("Natural Gas") && "gas_meter"]
    let KeyMaping = {
      electric_meter: "Electric Meter #",
      water_meter: "Water Meter #",
      gas_meter: "Gas Meter #"
    }
    tempObject && Object.keys(tempObject).every(ele => {
      if (requiredFields.includes(ele)) {
        if (tempObject[ele] == "") {
          setErrorFields(KeyMaping[ele])
          setIsCollapsed((ele == 'electric_meter' || ele == 'electric') ? "Electric" : (ele == 'water' || ele == 'water_meter') ? "Water" : (ele == 'gas_fuel_tank' || ele == 'gas_meter') ? "Gas/Fuel Tank" : ele == 'sewer' && 'Sewer')
          hasNoError = false
          setErrorState(true)
          setIsSubmitting(false);
          return false;
        }
        hasNoError = true
        setIsCollapsed('')
        setErrorState(false)
        return true;
      }
      return true;
    })
    console.log(hasNoError && hasNoError, "NO GC MODAL ERROR");
    /// check not have any error and upload the data
    // hasNoError && hasNoError && console.log("frfrfr");
    hasNoError && hasNoError ? updateSfVendorFormDetails(inspVfDetails, inspId, false).then(result => {
      result && updateSfVendorFormDetails(tempObject, inspId, true).then(response => {
        console.log("VENDOR FORM SUBMISSION :", response)
        setIsSubmitting(false);
        handleCloseModal();
        alert("Submitted Successfully") // ! Need a proper alert component here
        setreadonly(true)
        navigation.navigate('HomeStack')
      }).catch(err => {
        setIsSubmitting(false);
      })
    }).catch(err => {
      setIsSubmitting(false);
    }) : setIsSubmitting(false);
  }

  const handleCancel = () => {
    setErrorState(false)
    handleCloseModal();
  }

  const requiredLabel = ["Electric Meter #", "Water Meter #"]

  return (
    <>
      <ExpandSection>
        <Row>
          <Header>
            <Text style={{ fontSize: 18, fontFamily: 'URBAN_BOLD', color: 'black' }}>Submit for Review</Text>
          </Header>
        </Row>
        {errorState && <Row>
          <ErrorBanner>
            <Text>Please fill all the required fields</Text>
          </ErrorBanner>
          <Spacer position="bottom" size="large" />
        </Row>}
        <View style={{ flexWrap: "wrap", padding: 2 }}>
          {checkList && Object.keys(checkList).map((ele, i) => {
            let meterMapping = {
              Electric: "Electric Meter #",
              Water: "Water Meter #",
              "Gas/Fuel Tank": "Gas Meter #",
              Sewer: "Septic"
            }
            let selectMapping = {
              Electric: "Electric On",
              Water: "Water On",
              "Gas/Fuel Tank": "Gas On",
              Sewer: "Well",
            }
            let meterKey = meterMapping[ele]
            let selectKey = selectMapping[ele]
            const iconUrl =  ele =="Electric"? require( '../../../assets/images/electricity.png'):ele =="Water"? require( '../../../assets/images/water.png'):ele =="Gas/Fuel Tank"&& require( '../../../assets/images/gas.png')
            return (
              <View style={{
                width: "100%", padding: 1, 
                color: '#FFFFFF', borderRadius: 5,top:5
              }} key={ele} >
                <Pressable onPress={() => setIsCollapsed(isCollapsed == ele ? '' : ele)} style={{ flexDirection: 'row', justifyContent: "space-between", padding: 5, backgroundColor: '#262626', borderRadius: 5}}>
                  <Spacer position={'top'} size={'small'} />
                  <View style={{ flex: 1, flexDirection: 'row',left:'3%' }}>
                    <Text style={{ fontSize: 17, fontFamily: 'URBAN_BOLD', color: 'red' }}>*</Text>
                    <Text style={{ fontSize: 17, fontFamily: 'URBAN_BOLD', color: 'white' }}>
                      {ele.toUpperCase()}
                    </Text>
                  </View>
                  <Icon size={25} name={`${isCollapsed == ele ? "keyboard-arrow-up" : "keyboard-arrow-down"}`} color={'white'} />
                  <Spacer position={'bottom'} size={'small'} />
                </Pressable>
                <Collapsible collapsed={!(isCollapsed == ele)}  style={{shadowColor:'black', borderWidth:1, borderRadius:5,padding:10}} >
                <View style={{left:'58%',top:-10}}>
                  {iconUrl !== undefined && <Image style={{resizeMode:'strech',position: 'absolute'}} source={iconUrl} />}
                  </View>
                  <View style={{ flexDirection: 'row',  }} >
                    <View style={{ width: '50%' }}>
                      <Spacer position={'top'} size={'small'} />
                      {
                        Object.keys(checkList[ele]).map((item, i) => {
                          return (
                            <CheckListbox key={ele + i}
                              isChecked={checkList[ele][item] ? true : false}
                              onClick={() => { handleIsChacked(ele, item, checkList[ele][item]) }
                              }
                              rightText={item}
                            />
                          )

                        })}
                    </View>

                    {<View style={{ width: '50%' }}>
                      {meterKey !== 'Septic' ? <View>
                        <InputField
                          label={`*${meterKey}`}
                          value={textObj[meterKey]}
                          onChangeText={text => { handleTextChange(meterKey, text) }}
                          error={meterKey == errorFields}
                        />
                      </View>
                        : <View>
                          <Text style={{ fontSize: 15, fontFamily: 'URBAN_REGULAR', color: 'black' }}>{meterKey} :</Text>
                          <Dropdown label="Select an Option" data={data} callBack={handleSelectChange}   {...{ selectKey: 'selectKey' }} />
                        </View>
                      }
                      <Spacer position={'top'} size={'medium'} />
                      <View>
                        <Text style={{ fontSize: 15, fontFamily: 'URBAN_REGULAR', color: 'black' }}>{selectKey} :</Text>
                        <Spacer position={'bottom'} size={'small'} />
                        <Dropdown label="Select an Option" data={data} callBack={handleSelectChange}   {...{ selectKey }} />
                      </View>
                    </View>}
                  </View>
                  {ele == "Gas/Fuel Tank" && <View style={{ flexDirection: 'row',  justifyContent: 'space-between' }}>
                    <View style={{ width: '49%' }}>
                      <Text>Propane :</Text>
                      <Spacer position={'bottom'} size={'small'} />
                      <Dropdown label="Select an Option" data={data} callBack={handleSelectChange}   {...{ selectKey: "Propane" }} />
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text>Oil :</Text>
                      <Spacer position={'bottom'} size={'small'} />
                      <Dropdown label="Select an Option" data={data} callBack={handleSelectChange}   {...{ selectKey: "Oil" }} />
                    </View>
                  </View>}
                  <Spacer position={'top'} size={'small'} />
                </Collapsible>
              </View>
            )
          })}

          <Spacer position={'top'} size={'small'} />
          <View style={{ flexDirection: 'row' }} >
            <View style={{ width: '100%', marginRight: 5 }}>
              <Text>Utility Notes :</Text>
              <InputField
                value={textObj["Utility Notes"]}
                onChangeText={text => { handleTextChange("Utility Notes", text) }}
              />
            </View>
          </View>
        </View>
        <Spacer position={'top'} size={"large"} />
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "center" }}>
          <Button disabled={isSubmitting} loading={isSubmitting} onPress={() => HnadleSubmitUtility()} mode="contained" style={{ backgroundColor: "#8477EB" }}>Save</Button>
          <Button disabled={isSubmitting} onPress={() => handleCancel()} labelStyle={{ color: "#8477EB" }}>Cancel</Button>
        </View>
        {Platform.OS == 'ios' && <KeyboardSpacer />}
      </ExpandSection>
    </>
  )
}