import React, { useEffect, useState } from "react";
import { ExpandSection, CheckListbox, Header, InputField, ErrorBanner, RequireMarkText } from "./SubmitReviewFormStyle"
import { Row, Col } from 'react-native-responsive-grid-system';
import { Text } from "../../../components/typography/text.component";
import { Pressable, View, } from 'react-native'
import { Spacer } from "../../../components/spacer/spacer.component";
import { updateSfVendorFormDetails } from "../../../services/inspections/inspections.service";
import { Button } from "react-native-paper";


export const SubmitReviewForm = ({ handleCloseModal, setreadonly, inspVfDetails, inspId, navigation, setIsNotesCollapsed }) => {

  const [checkList, setCheckList] = useState(checkListObj)
  const [textObj, setTextObj] = useState({ "Electric Meter #": '', "Water Meter #": '', "Gas Meter #": '', "Utility Notes": '' })
  const [selectListObject, setSelectListObj] = useState({ "Electric On": '', "Water On": '', "Gas On": '', "Septic": '', "Well": '', "Propane": '', "Oil": '' })
  const [errorState, setErrorState] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false);

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




  const customSelector = (ele, CurrentValue) => {
    const handleSelectChange = (item, value) => {
      selectListObject && Object.keys(selectListObject).map(data => {
        data == item && setSelectListObj({ ...selectListObject, [data]: value })
        return
      })
    }

    return (
      <View style={{ width: '30%', height: 30, }}>
        <Row >
          <Pressable onPress={() => { handleSelectChange(ele, "Yes") }} style={{ width: '49%', height: "100%", borderEndWidth: 1, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, borderWidth: .5, alignItems: 'center', backgroundColor: `${CurrentValue == "Yes" ? "grey" : "white"}` }}>
            <Text>Yes</Text>
          </Pressable>
          <Pressable onPress={() => { handleSelectChange(ele, "No") }} style={{ width: '50%', height: "100%", borderEndWidth: 1, borderTopRightRadius: 5, borderBottomRightRadius: 5, borderWidth: .5, alignItems: 'center', backgroundColor: `${CurrentValue == "No" ? "grey" : "white"}` }}>
            <Text>No</Text>
          </Pressable>
        </Row>
      </View>
    )
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
    let requiredFields = ["electric", "water", "gas_fuel_tank", "sewer", "electric_meter", "water_meter"]
    tempObject && Object.keys(tempObject).every(ele => {
      // console.log(ele,);
      if (requiredFields.includes(ele)) {
        if (tempObject[ele] == "") {
          hasNoError = false
          setErrorState(true)
          return false;
        }
        hasNoError = true
        setErrorState(false)
        return true;
      }
      return true;
    })
    console.log(hasNoError && hasNoError, "ooo");

    /// check not have any error and upload the data
    // hasNoError && hasNoError && console.log("frfrfr");
    hasNoError && hasNoError && updateSfVendorFormDetails(inspVfDetails, inspId, false).then(result => {
      result && updateSfVendorFormDetails(tempObject, inspId, true).then(response => {
        console.log("VENDOR FORM SUBMISSION :", response)
        setIsSubmitting(false);
        handleCloseModal();
        alert("Submitted Successfully") // ! Need a proper alert component here
        setreadonly(true)
        navigation.navigate('HomeStack')
      })
    })
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
          <Header><Text>Submit for Review</Text></Header>
        </Row>
        {errorState && <Row>
          <ErrorBanner>
            <Text>Please Fill all fields</Text>
          </ErrorBanner>
          <Spacer position="bottom" size="large" />
        </Row>}
        <View style={{ flexDirection: "row", width: "100%", flexWrap: "wrap", padding: 2 }}>
          {checkList && Object.keys(checkList).map(ele => {
            return (
              <View style={{ width: "50%", padding: 6 }} key={ele}>
                <Text>*{ele}:</Text>
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
            )
          })}

        </View>
        <View style={{ flexDirection: "row", width: "100%", flexWrap: "wrap" }}>
          {
            textObj && Object.keys(textObj).map(ele => {
              let showText = requiredLabel.includes(ele) ? '*' + ele : ele
              return (
                <View style={{ width: "50%", padding: 4 }} key={ele}>
                  <InputField
                    label={showText}
                    value={textObj[ele]}
                    onChangeText={text => { handleTextChange(ele, text) }}
                  />
                </View>
              )
            })
          }
        </View>
        <Spacer position={'top'} size={"large"} />
        <View style={{ flexDirection: "row", width: "100%", flexWrap: "wrap" }}>
          {selectListObject && Object.keys(selectListObject).map(ele => {
            let key = String(ele)
            return (
              <View key={ele} style={{ width: "50%", flexDirection: "row" }} >
                <Text>{ele} : </Text>
                {customSelector(ele, selectListObject[ele])}
              </View>
            )
          })}
        </View>
        <View style={{flexDirection:"row", width:"100%",justifyContent:"flex-end"}}>
          <Button disabled={isSubmitting} loading={isSubmitting} onPress={() => HnadleSubmitUtility()} mode="contained" style={{backgroundColor:"#8477EB"}}>Save</Button>
          <Button disabled={isSubmitting} onPress={() => handleCancel()} labelStyle={{color:"#8477EB"}}>Cancel</Button>
        </View>
      </ExpandSection>
    </>
  )
}