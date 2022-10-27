import styled from "styled-components/native";
import Overlay from 'react-native-modal-overlay';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "react-native-paper";
import Swipeable from 'react-native-swipeable';
import { View, TouchableOpacity, Text } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";


let requiredSubCategories = [
  "Off Matrix - Pool",
  "Off Matrix - Exterior",
  "Off Matrix - Interior",
  "Off Matrix - MEP"
]


export default function FormLineItem({ item,onRoomMeasurementValueChange,onOtherFormValueChange, isForRoomMeasurement, onValueChange, navigation, readOnly, setShowAddButton, handleOnSave }) {
  const [overlayVisible, setOverlayVisible] = React.useState(false)


  const rightButtons = [
    <TouchableOpacity onPress={() => { alert("Add Notes") }} style={{ backgroundColor: '#F0BA91', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
      <View>
        <MaterialCommunityIcons name="note-plus" size={24} />
        {/* <Text>Add Notes</Text> */}
      </View>
    </TouchableOpacity>,
    <TouchableOpacity onPress={() => { alert("Delete") }} style={{ backgroundColor: '#F3206F', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
      <View>
        <MaterialCommunityIcons name="delete" size={24} color="white" />
        {/* <Text>Delete</Text> */}
      </View>
    </TouchableOpacity>
  ];


  const Sub_Category_Keys = ["Off Matrix - Pool", "Off Matrix - Exterior", "Off Matrix - Interior", "Off Matrix - MEP"]
  const Category_Keys = ["Pools", "Exterior", "Interior", "Mechanical, Electrical and Plumbing Systems"]

  React.useEffect(() => {
    setShowAddButton(Category_Keys.includes(item?.Category) ? true : false)
  }, [])


  if (isForRoomMeasurement) {

    let length, width, misc;
    const Sub_Category_List = ["Garage", "Foyed", "Family Room", "Breakfast Nook", "Kitchen", "Laundry Room", "Formal Living Room", "Hallway 1", "Hallway 2", "Half Bathroom", "Master Bathroom", "Bathroom 2", "Bathroom 3", "Master Bedroom", "Bedroom 2", "Bedroom 3", "Bedroom 4", "Gameroom", "Office/Study", "Basement", "master closet", "Dining Room",]


    function getFormatedRowValues(value) {
      if (value === undefined || value === null) {
        return 0;
      }
      return value > 1 ? value.toString().replace(/^0+/, '') : value;
    }

    const handleDelete = (dvdId, inspId, UniqueKey) => {
      deleteNewItem(dvdId, inspId, UniqueKey)
    }

    length = getFormatedRowValues(item.Room_Length);
    width = getFormatedRowValues(item.Room_Width);
    misc = getFormatedRowValues(item.Room_Misc_SF)


    return (
      <>
        <Swipeable rightButtons={rightButtons}>
          <LineItemWrapper >
            <View style={{ flex: 1 }}>
              {/* Room */}
              {(Sub_Category_List.includes(item.Sub_Category) || readOnly)
                ?
                <StyledText>{item.Sub_Category}</StyledText>
                :
                <StyledTextInput
                  onChangeText={val => onRoomMeasurementValueChange((val), "Sub_Category", item.UniqueKey)}
                  value={`${item.Sub_Category}`}
                />}
              <LineItemInputGroup>
                {/* Length */}
                <LineItemInputText onPress={() => setOverlayVisible(true)}>Length {length}</LineItemInputText>
                {/* Width */}
                <LineItemInputText onPress={() => setOverlayVisible(true)}>Width {width}</LineItemInputText>
                {/* Misc */}
                <LineItemInputText onPress={() => setOverlayVisible(true)}>Misc {misc}</LineItemInputText>
              </LineItemInputGroup>
            </View>
            {/* Icon */}
            <Ionicons name="camera" size={24} />

          </LineItemWrapper>
        </Swipeable>
        <Overlay visible={overlayVisible} onClose={() => setOverlayVisible(false)} closeOnTouchOutside >
          {(Sub_Category_List.includes(item.Sub_Category) || readOnly)
            ?
            <StyledText>{item.Sub_Category}</StyledText>
            :
            <StyledTextInput
              onChangeText={val => onRoomMeasurementValueChange((val), "Sub_Category", item.UniqueKey)}
              value={`${item.Sub_Category}`}
            />}

          <CustomFormInput
            label="Length"
            placeholder="Length"
            onChangeText={val => onRoomMeasurementValueChange((val), "Room_Length", item.UniqueKey)}
            readOnly={readOnly}
            value={length}
          />

          <CustomFormInput
            label="Width"
            placeholder="Width"
            onChangeText={val => onRoomMeasurementValueChange((val), "Room_Width", item.UniqueKey)}
            readOnly={readOnly}
            value={width}
          />
          <CustomFormInput
            label="Misc"
            placeholder="Misc"
            onChangeText={val => onRoomMeasurementValueChange((val), "Room_Misc_SF", item.UniqueKey)}
            readOnly={readOnly}
            value={misc}
          />

          {!readOnly && <StyledSaveButton onPress={() => {
            handleOnSave(true); 
            setOverlayVisible(false)}} mode="contained">Save</StyledSaveButton>}

        </Overlay>
      </>

    )

  }


  return (
    <>
      <Swipeable rightButtons={rightButtons}>
        <LineItemWrapper >
          <View style={{ flex: 1 }}>
            {
              Sub_Category_Keys.includes(item?.Sub_Category)
                ?
                <StyledTextInput
                  onChangeText={val => onOtherFormValueChange((val), "Matrix_Price", item.UniqueKey)}
                  value={`${item?.Matrix_Price ?? 0}`}
                />
                :
                <LineItemHeading>
                  {item?.Matrix_Price}
                </LineItemHeading>
            }
            <LineItemInputGroup>
              {/* QTY */}
              <LineItemInputText onPress={() => setOverlayVisible(true)}>Qty {item.Quantity}</LineItemInputText>
              {/* RATE */}
              <LineItemInputText onPress={() => setOverlayVisible(true)}>Rate ${item.Rate}</LineItemInputText>
              {/* NOTES */}
              <LineItemInputText onPress={() => setOverlayVisible(true)}>Total ${item.Total}</LineItemInputText>
            </LineItemInputGroup>
          </View>
          {/* Icon */}
          <Ionicons name="camera" size={24} />

        </LineItemWrapper>
      </Swipeable>
      <Overlay visible={overlayVisible} onClose={() => setOverlayVisible(false)} closeOnTouchOutside >

        {
          Sub_Category_Keys.includes(item?.Sub_Category)
            ?
            <StyledTextInput
              onChangeText={val => onOtherFormValueChange((val), "Matrix_Price", item.UniqueKey)}
              value={`${item?.Matrix_Price ?? 0}`}
            />
            :
            <LineItemHeading>
              {item?.Matrix_Price}
            </LineItemHeading>
        }

        <CustomFormInput
          label="Quantity"
          placeholder="QTY"
          onChangeText={val => onOtherFormValueChange((val), "Quantity", item.UniqueKey)}
          readOnly={readOnly}
          value={item.Quantity}
        />

        <CustomFormInput
          label="U/A"
          placeholder="U/A"
          onChangeText={val => onOtherFormValueChange((val), "U_M", item.UniqueKey)}
          readOnly={readOnly}
          value={item.U_M}
        />

        <StyledTextInputLabel>Rate</StyledTextInputLabel>
        {readOnly ? <StyledText>${item.Rate ?? 0}</StyledText> :
          requiredSubCategories.includes(item.Sub_Category) ?
            <StyledTextInput

              onChangeText={val => {
                onOtherFormValueChange(Number((val.replace("$", ""))), "Rate", item.UniqueKey)
              }}
              value={`$${item.Rate}`}
              keyboardType="number-pad"
            />
            :
            <StyledText>${item.Rate ?? 0}</StyledText>
        }
        <CustomFormInput
          label="Total"
          readOnly={true}
          value={`$${item.Total}`}
        />
        <CustomFormInput
          label="Scope Notes"
          placeholder="Scope Notes"
          onChangeText={val => onOtherFormValueChange((val), "Scope_Notes", item.UniqueKey)}
          readOnly={readOnly}
          value={item.Scope_Notes}
        />

        {!readOnly && <StyledSaveButton onPress={() => { handleOnSave(); setOverlayVisible(false)}} mode="contained">Save</StyledSaveButton>}

      </Overlay>
    </>

  )

}

function CustomFormInput({ readOnly = false, onChangeText = () => { }, value, label, placeholder }) {
  return (
    <>
      <StyledTextInputLabel>{`${label}`}</StyledTextInputLabel>
      {
        readOnly ?
          <StyledText>{value ?? 0}</StyledText> :
          <StyledTextInput
            onChangeText={onChangeText}
            value={`${value ?? 0}`}
            placeholder={placeholder}
          />
      }
    </>

  )
}


const LineItemWrapper = styled.TouchableOpacity`
background-color: #F1F4F8;
padding: 16px 32px 8px;
flex-direction: row;
`;

const LineItemHeading = styled.Text`
font-size: 16px;
font-family: 'URBAN_REGULAR';
`;

const LineItemInputGroup = styled.View`
flex-direction: row;
`;

const LineItemInputText = styled.Text`
font-family: 'URBAN_BOLD';
font-size: 16px;
color: #469869;
flex: 1;

`;

const StyledTextInputLabel = styled.Text`
font-size: 14px;
font-family: 'URBAN_BOLD';
align-self: flex-start;
margin-bottom: 4px;
`;

const StyledTextInput = styled.TextInput`
background-color: #d9d9d980;
border-radius: 4px;
width: 100%;
padding:12px;
margin-bottom: 8px;
`;

const StyledText = styled.Text`
border-radius: 4px;
width: 100%;
font-size: 16px;
font-family: 'URBAN_MEDIUM';
margin-bottom: 8px;
`;

const StyledSaveButton = styled(Button)`
margin: 8px 0;
align-self: flex-end;
`;