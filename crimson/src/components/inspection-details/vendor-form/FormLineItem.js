import styled from "styled-components/native";
import Overlay from 'react-native-modal-overlay';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button, Card, Modal, Portal, Provider } from "react-native-paper";
import Swipeable from 'react-native-swipeable';
import { View, TouchableOpacity, Text, TextInput } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign"


let requiredSubCategories = [
  "Off Matrix - Pool",
  "Off Matrix - Exterior",
  "Off Matrix - Interior",
  "Off Matrix - MEP"
]


export default function FormLineItem({ isSubmitted, isForContractorView, inspId, item, onRoomMeasurementValueChange, onOtherFormValueChange, isForRoomMeasurement, onValueChange, navigation, readOnly, setShowAddButton, handleOnSave }) {
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

  if (isSubmitted) {
    return <SubmittedFormLineItem {...{ title: item.Matrix_Price, rate: item.Rate, quantity: item.Quantity }} />
  }

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
            setOverlayVisible(false)
          }} mode="contained">Save</StyledSaveButton>}

        </Overlay>
      </>

    )

  }

  if (isForContractorView) {
    return (
      <ContractorViewLineItem {...{ title: item.Matrix_Price, rate: item.Rate, quantity: item.Quantity }} />
    )

  }


  return (
    <>
      <Swipeable rightButtons={rightButtons}>
        <LineItemWrapper >
          <View style={{ flex: 1 }}>
            {
              <LineItemHeading>
                {item?.Matrix_Price}
              </LineItemHeading>
            }
            <LineItemInputGroup>
              {/* QTY */}
              <LineItemInputText onPress={() => setOverlayVisible(true)}>Qty {item.Quantity}</LineItemInputText>
              {/* RATE */}
              <LineItemInputText onPress={() => setOverlayVisible(true)}>Rate {getFormattedValue("Rate", item.Rate)}</LineItemInputText>
              {/* NOTES */}
              <LineItemInputText onPress={() => setOverlayVisible(true)}>Total {getFormattedValue("Total", item.Total)}</LineItemInputText>
            </LineItemInputGroup>
          </View>
          {/* Icon */}
          <Ionicons name="camera" onPress={() => navigation.navigate("CameraScreen", { inspId: { inspId }, lineItemId: item.Id })} size={24} />

        </LineItemWrapper>
      </Swipeable>
      <Overlay visible={overlayVisible} onClose={() => setOverlayVisible(false)} closeOnTouchOutside >

        {
          Sub_Category_Keys.includes(item?.Sub_Category)
            ?
            <>
              <StyledTextInputLabel>Matrix Price</StyledTextInputLabel>
              <StyledTextInput
                onChangeText={val => onOtherFormValueChange((val), "Matrix_Price", item.UniqueKey)}
                value={`${item?.Matrix_Price ?? 0}`}
              />
            </>
            :
            <LineItemHeading>
              {item?.Matrix_Price}
            </LineItemHeading>
        }

        <View style={{ flexDirection: "row" }}>

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

        </View>

        <View style={{ flexDirection: "row" }}>

          <View style={{ width: '100%', flex: 1, marginHorizontal: 4 }}>
            <StyledTextInputLabel>Rate</StyledTextInputLabel>
            {
              <StyledTextInput
                editable={!readOnly && requiredSubCategories.includes(item.Sub_Category)}
                onChangeText={val => {
                  onOtherFormValueChange(Number((val.replace("$", ""))), "Rate", item.UniqueKey)
                }}
                value={getFormattedValue("Rate", item.Rate)}
                keyboardType="number-pad"
              />
            }
          </View>

          <CustomFormInput
            label="Total"
            readOnly={true}
            value={item.Total}
          />

        </View>

        <View style={{ flexDirection: "row" }}>
          <CustomFormInput
            label="Scope Notes"
            placeholder="Scope Notes"
            onChangeText={val => onOtherFormValueChange((val), "Scope_Notes", item.UniqueKey)}
            readOnly={readOnly}
            value={item.Scope_Notes}
          />
        </View>

        {!readOnly &&
          <StyledSaveButton onPress={() => { handleOnSave(); setOverlayVisible(false) }} mode="contained">
            <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: "URBAN_BOLD", fontSize: 18 }}>
              SWIPE TO SAVE <AntDesign size={16} name="doubleright" />
            </Text>
          </StyledSaveButton>}

      </Overlay>
    </>

  )

}


function SubmittedFormLineItem({ title, rate, quantity, total }) {
  return (
    <Card style={{ padding: 16, backgroundColor: "white", borderBottomWidth: 2, borderColor: '#EEBC7B' }}>
      <LineItemHeading>{title}</LineItemHeading>
      <View >
        {/* Details */}
        <View style={{ flexDirection: 'row' }}>
          <StyledContractorText style={{flex:1,fontSize:14}}>QTY: {quantity}</StyledContractorText>
          <StyledContractorText style={{flex:1,fontSize:14}} >RATE: {rate ? rate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          <StyledContractorText style={{flex:1,fontSize:14}}>TOTAL: {total ? total?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          <StyledContractorButton labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }} backgroundColor="#7CDD9B" mode="contained">A</StyledContractorButton>
        </View>
        <View style={{ flexDirection: 'row',marginTop:8}}>
          <StyledContractorText style={{flex:1,fontSize:18}}>ADJ QTY: {quantity}</StyledContractorText>
          <StyledContractorText style={{flex:1,fontSize:18}} >RATE: {rate ? rate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          <StyledContractorText style={{flex:1,fontSize:18}}>TOTAL: {total ? total?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
        </View>
      </View>
    </Card>
  )
}

function ContractorViewLineItem({ title, rate, quantity, total }) {

  const [bgColor, setBgColor] = React.useState("default");

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  function acceptLineItem() {
    setBgColor("#F7F4DE");
  }

  function reviewLineItem() {
    showModal();
  }

  function deleteLineItem() {
    setBgColor("#F8D9CF")
  }




  return (
    <>
      <Card style={{ padding: 16, backgroundColor: bgColor, borderBottomWidth: 2, borderColor: '#EEBC7B' }}>
        <LineItemHeading>{title}</LineItemHeading>
        <View style={{ flexDirection: 'row' }}>
          {/* Details */}
          <View style={{ flex: .2 }}>
            <StyledContractorText>QTY: {quantity}</StyledContractorText>
            <StyledContractorText>RATE: {rate ? rate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
            <StyledContractorText>TOTAL: {total ? total?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          </View>
          <View style={{ flex: .8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <StyledContractorButton labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }} backgroundColor="#7CDD9B" mode="contained" onPress={() => acceptLineItem()}>A</StyledContractorButton>
            <StyledContractorButton labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }} backgroundColor="#3983EF" mode="contained" onPress={() => reviewLineItem()}>R</StyledContractorButton>
            <StyledContractorButton labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }} backgroundColor="#E02E2E" mode="contained" onPress={() => deleteLineItem()}>D</StyledContractorButton>
          </View>
        </View>
      </Card>
      <Overlay childrenWrapperStyle={{ padding: 18 }} containerStyle={{ backgroundColor: '#dbdad960' }} visible={visible} onClose={() => setVisible(false)} closeOnTouchOutside >
        <Ionicons onPress={() => hideModal()} name="close" size={24} style={{ marginLeft: "auto" }} />
        <View style={{ minHeight: 360, width: "100%", backgroundColor: "black" }} />
        <Text style={{ width: "100%", padding: 10, fontFamily: 'URBAN_MEDIUM', fontSize: 16, color: "#BDC5CD" }}>{title}</Text>
        <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-even', width: "100%" }}>
          <StyledOverlayText >QTY: {quantity}</StyledOverlayText>
          <StyledOverlayText style={{ flex: 1 }}>RATE: {rate ?? 0}</StyledOverlayText>
          <StyledOverlayText style={{ flex: 1 }}>TOTAL: {total ?? 0}</StyledOverlayText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-even', width: "100%" }}>
          <StyledOverlayInputWrapper style={{ flexDirection: 'row' }}>
            <StyledOverlayInputLabel>ADJ QTY: </StyledOverlayInputLabel>
            <StyledOverlayInput value={`${quantity}`} />
          </StyledOverlayInputWrapper>
          <StyledOverlayInputWrapper style={{ flexDirection: 'row' }}>
            <StyledOverlayInputLabel>RATE: </StyledOverlayInputLabel>
            <StyledOverlayInput value={`${rate ?? 0}`} />
          </StyledOverlayInputWrapper>
          <StyledOverlayInputWrapper style={{ flexDirection: 'row' }}>
            <StyledOverlayInputLabel>TOTAL: </StyledOverlayInputLabel>
            <StyledOverlayInput value={`${total ?? 0}`} />
          </StyledOverlayInputWrapper>
        </View>

        <View style={{ width: "100%", marginVertical: 8 }}>
          <Text style={{ fontSize: 16, fontFamily: 'URBAN_BOLD', color: '#BDC5CD' }}>OWNER CLARIFICATIONS:</Text>
          <TextInput
            style={{ padding: 10, fontFamily: 'URBAN_MEDIUM', fontSize: 16, color: "#BDC5CD" }}
            multiline
            numberOfLines={4}
            value={"TextInput has by default a border at the bottom of its view. This border has its padding set by the background image provided by the system, and it cannot be changed. Solutions to avoid this are to either not set height explicitly, in which case the system will take care of displaying the border in the correct position, or to not display the border by setting underlineColorAndroid to transparent."}
          />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Button onPress={() => hideModal()} mode="contained" labelStyle={{ fontSize: 18, fontFamily: 'URBAN_BOLD' }} style={{ backgroundColor: "#EF39A0", padding: 4 }}>Cancel</Button>
          <Button mode="contained" labelStyle={{ fontSize: 18, fontFamily: 'URBAN_BOLD' }} style={{ backgroundColor: "#ABDF8C", padding: 4, marginLeft: 16 }}>Approve</Button>
        </View>

      </Overlay>
    </>
  )
}


const StyledOverlayText = styled.Text`
flex:1;
color: #EEC690;
font-family: URBAN_BOLD;
font-size: 16px;
text-align: center;
`;

const StyledOverlayInputWrapper = styled.View`
flex-direction: row;
margin:0  8px;

`

const StyledOverlayInputLabel = styled.Text`
color: #EEC690;
font-family: URBAN_BOLD;
font-size: 20px;
`;
const StyledOverlayInput = styled.TextInput`
color: #EEC690;
font-family: URBAN_BOLD;
font-size: 20px;
`;







function getFormattedValue(fieldName, value) {
  if (fieldName === "Total" || fieldName === "Rate") {
    if (value) {
      return value.toLocaleString("en-IN", { style: "currency", currency: 'USD' });
    } else {
      return '0';
    }
  } else {
    console.log("returing value");
    return value;
  }
}


function CustomFormInput({ readOnly = false, onChangeText = () => { }, value, label, placeholder }) {

  const editable = !readOnly;

  return (
    <View style={{ width: '100%', flex: 1, marginHorizontal: 4 }}>
      <StyledTextInputLabel>{`${label}`}</StyledTextInputLabel>
      {
        <StyledTextInput
          onChangeText={onChangeText}
          value={`${getFormattedValue(label, value) ?? 0}`}
          placeholder={placeholder}
          editable={editable}
        />
      }
    </View>

  )
}


const LineItemWrapper = styled.TouchableOpacity`
background-color: #F1F4F8;
padding: 16px 32px 8px;
flex-direction: row;
`;

const LineItemHeading = styled.Text`
font-size: 16px;
margin-bottom: 8px;
font-family: 'URBAN_REGULAR';
`;

const LineItemInputGroup = styled.View`
flex-direction: row;
`;

const LineItemInputText = styled.Text`
font-family: 'URBAN_BOLD';
font-size: 16px;
color: #469869;
margin-left: 8px;

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

const StyledSaveButton = styled.TouchableOpacity`
margin: 8px 0;
align-self: flex-end;
width: 100%;
background-color: #8477EB;
padding: 8px;
border-radius: 32px;
justify-content: center;
align-items: center;
`;

const StyledContractorButton = styled(Button)`
background-color: ${props => props.backgroundColor};
flex: 1;
margin:0 4px;
padding:6px;
border-radius:100/2;
`;

const StyledContractorText = styled(LineItemInputText)`
color: black;
font-family: 'URBAN_REGULAR';
font-size: 12px;
`;