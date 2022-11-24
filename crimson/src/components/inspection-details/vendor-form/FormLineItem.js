import styled from "styled-components/native";
import Overlay from 'react-native-modal-overlay';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button, Card, Modal, Portal, Provider } from "react-native-paper";
import Swipeable from 'react-native-swipeable';
import { View, TouchableOpacity, Text, TextInput } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign"
import { getVendorFormDetails } from "../../../services/inspections/inspections.service";


let requiredSubCategories = [
  "Off Matrix - Pool",
  "Off Matrix - Exterior",
  "Off Matrix - Interior",
  "Off Matrix - MEP"
]


export default function FormLineItem({ isSubmittedByReviewer, handleAcceptLineItem, isSubmitted, isForReviewerView, inspId, item, onRoomMeasurementValueChange, onOtherFormValueChange, isForRoomMeasurement, deleteNewItem, navigation, readOnly, setShowAddButton, handleOnSave }) {
  const [overlayVisible, setOverlayVisible] = React.useState(false)


  const rightButtons = [
    <TouchableOpacity onPress={() => { alert("Add Notes") }} style={{ backgroundColor: '#F0BA91', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
      <View>
        <MaterialCommunityIcons name="note-plus" size={24} />
        {/* <Text>Add Notes</Text> */}
      </View>
    </TouchableOpacity>,
    <TouchableOpacity onPress={() => handleDelete(item.Id, inspId, item.UniqueKey)} style={{ backgroundColor: '#F3206F', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
      <View>
        <MaterialCommunityIcons name="delete" size={24} color="white" />
        {/* <Text>Delete</Text> */}
      </View>
    </TouchableOpacity>
  ];

  const roomRightButtons = [
    <TouchableOpacity onPress={() => { alert("Add Notes") }} style={{ backgroundColor: '#F0BA91', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
      <View>
        <MaterialCommunityIcons name="note-plus" size={24} />
        {/* <Text>Add Notes</Text> */}
      </View>
    </TouchableOpacity>
  ];


  const Sub_Category_Keys = ["Off Matrix - Pool", "Off Matrix - Exterior", "Off Matrix - Interior", "Off Matrix - MEP"]
  const Category_Keys = ["Pools", "Exterior", "Interior", "Mechanical, Electrical and Plumbing Systems"]

  React.useEffect(() => {
    setShowAddButton(Category_Keys.includes(item?.Category))
  }, [item])

  const handleDelete = (dvdId, inspId, UniqueKey) => {
    console.log("DELETING", dvdId);
    deleteNewItem(dvdId, inspId, UniqueKey)
  }

  if (isSubmitted) {
    return <SubmittedFormLineItem {...{ status: item?.Approval_Status, title: item.Matrix_Price, rate: item.Rate, quantity: item.Quantity, notes: item.Scope_Notes }} />
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

    length = getFormatedRowValues(item.Room_Length);
    width = getFormatedRowValues(item.Room_Width);
    misc = getFormatedRowValues(item.Room_Misc_SF);


    return (
      <>
        <Swipeable rightButtons={roomRightButtons}>
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
          </LineItemWrapper>
        </Swipeable>
        <Overlay visible={overlayVisible} onClose={() => setOverlayVisible(false)} closeOnTouchOutside >
          {
            (Sub_Category_List.includes(item.Sub_Category) || readOnly)
              ?
              <StyledText>{item.Sub_Category}</StyledText>
              :
              <StyledTextInput
                onChangeText={val => onRoomMeasurementValueChange((val), "Sub_Category", item.UniqueKey)}
                value={`${item.Sub_Category}`}
              />
          }
          <View style={{ flexDirection: 'row' }}>
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
          </View>
          {!readOnly &&
            <Button
              onPress={() => {
                handleOnSave(true);
                setOverlayVisible(false);

              }} mode="contained">
              Save
            </Button>
          }
        </Overlay>
      </>

    )

  }

  if (isForReviewerView) {
    return (
      <ContractorViewLineItem {...{ inspId, isSubmittedByReviewer, handleAcceptLineItem, item, onOtherFormValueChange }} />
    )

  }


  return (
    <>
      <Swipeable rightButtons={Sub_Category_Keys.includes(item?.Sub_Category) ? rightButtons : rightButtons.slice(0, 1)}>
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
            <StyledTextInput
              editable={!readOnly && requiredSubCategories.includes(item.Sub_Category)}
              onChangeText={val => {
                onOtherFormValueChange(Number((val.replace("$", ""))), "Rate", item.UniqueKey)
              }}
              value={getFormattedValue("Rate", item.Rate)}
              keyboardType="number-pad"
            />
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


function SubmittedFormLineItem({ status, title, rate, quantity, total, notes }) {
  function getBackgroundColor() {
    if (status === "Approved") {
      return "#7CDD9B";
    } else if (status === "Declined") {
      return "#E02E2E";
    } else {
      return "#3983EF";
    }
  }
  function getCardBackgroundColor() {
    if (status === "Approved") {
      return "#E7F5CE";
    } else if (status === "Declined") {
      return "#F9DAD4";
    } else {
      return "#FDF2BF";
    }
  }
  return (
    <Card style={{ padding: 16, backgroundColor: getCardBackgroundColor(), borderBottomWidth: 2, borderColor: '#EEBC7B' }}>
      <LineItemHeading style={{}}>{title}</LineItemHeading>
      <LineItemHeading style={{}}>Scope Notes : {notes}</LineItemHeading>
      <View >
        {/* Details */}
        <View style={{ flexDirection: 'row' }}>
          <StyledContractorText style={{ flex: 1, fontSize: 14, }}>QTY: {quantity}</StyledContractorText>
          <StyledContractorText style={{ flex: 1, fontSize: 14, }} >RATE: {rate ? rate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          <StyledContractorText style={{ flex: 1, fontSize: 14, }}>TOTAL: {total ? total?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          <StyledContractorButton style={{ fontSize: 16, fontFamily: 'URBAN_BOLD', backgroundColor: getBackgroundColor(), padding: 4 }} mode="contained">{status}</StyledContractorButton>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <StyledContractorText style={{ flex: 1, fontSize: 18, }}>ADJ QTY: {quantity}</StyledContractorText>
          <StyledContractorText style={{ flex: 1, fontSize: 18, }} >RATE: {rate ? rate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          <StyledContractorText style={{ flex: 1, fontSize: 18, }}>TOTAL: {total ? total?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
        </View>
      </View>
    </Card>
  )
}

function ContractorViewLineItem({ inspId, isSubmittedByReviewer, handleAcceptLineItem, item, onOtherFormValueChange }) {

  const {
    UniqueKey,
    Adj_Quantity,
    Adj_Rate,
    Owner_Clarification,
    Id: id,
    Matrix_Price: title,
    Rate: rate,
    Quantity: quantity,
    Total: total
  } = item

  //  * GET LINE ITEM IMAGES 
  // TODO - getting all images , select only line item images
  const [allLineItemImages, setAllLineImages] = React.useState([]);

  async function getLineItemImages() {
    const data = await getVendorFormDetails(inspId);
    setAllLineImages(data.Images)
  }

  React.useEffect(() => {
    getLineItemImages();
  }, [inspId])



  function getBackgroundColor() {
    if (item.Approval_Status === "Approved") {
      return "#E7F5CE";
    } else if (item.Approval_Status === "Declined") {
      return "#F9DAD4";
    } else if (item.Approval_Status === "Approved as Noted") {
      return "#FCFBF3";
    }
    else {
      return "white";
    }
  }


  const [visible, setVisible] = React.useState(false);

  const [selectedStatus, setSelectedStatus] = React.useState(item?.Approval_Status);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  function acceptLineItem() {
    setSelectedStatus("Approved");
    handleAcceptLineItem(id, "Approved");
  }

  function reviewLineItem() {
    showModal();
  }

  function deleteLineItem() {
    setSelectedStatus("Declined");
    handleAcceptLineItem(id, "Declined");
  }

  function handleApproveAsNoted() {
    setSelectedStatus("Approved as Noted");
    handleAcceptLineItem(id, "Approved as Noted");
    hideModal();
  }

  function getGreyShade(status, orgColor) {
    if (selectedStatus === status && isSubmittedByReviewer) {
      return "grey"
    }
    if (selectedStatus === status) {
      return "grey"
    }
    if (isSubmittedByReviewer && selectedStatus !== "") {
      return "#d4d4d4";
    }
    return orgColor;
  }

  function isDisabled(status) {
    return isSubmittedByReviewer || selectedStatus === status;
  }


  return (
    <>
      <Card style={{ padding: 16, backgroundColor: getBackgroundColor(), borderBottomWidth: 2, borderColor: '#EEBC7B' }}>
        <LineItemHeading>{title}</LineItemHeading>
        {/* <LineItemHeading>{item.Approval_Status}</LineItemHeading> */}
        <LineItemHeading>Scope Notes : {item.Scope_Notes}</LineItemHeading>
        <View style={{ flexDirection: 'row' }}>
          {/* Details */}
          <View style={{ flex: .4 }}>
            <StyledContractorText>QTY: {quantity}</StyledContractorText>
            <StyledContractorText>RATE: {getCurrencyFormattedValue(rate)}</StyledContractorText>
            <StyledContractorText>TOTAL: {getCurrencyFormattedValue(total)}</StyledContractorText>
          </View>
          <View style={{ flex: .6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <StyledContractorButton
              labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }}
              disabled={isDisabled("Approved")}
              backgroundColor={getGreyShade("Approved", "#7CDD9B")}
              mode="contained"
              onPress={() => acceptLineItem()}>
              A
            </StyledContractorButton>
            <StyledContractorButton
              labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }}
              disabled={isDisabled("Approved as Noted")}
              backgroundColor={getGreyShade("Approved as Noted", "#3983EF")}
              mode="contained"
              onPress={() => reviewLineItem()}>
              R
            </StyledContractorButton>
            <StyledContractorButton
              labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }}
              disabled={isDisabled("Declined")}
              backgroundColor={getGreyShade("Declined", "#E02E2E")}
              mode="contained"
              onPress={() => deleteLineItem()}>
              D
            </StyledContractorButton>
          </View>
        </View>
      </Card>
      <Overlay childrenWrapperStyle={{ padding: 18 }} containerStyle={{ backgroundColor: '#dbdad960' }} visible={visible} onClose={() => setVisible(false)} closeOnTouchOutside >
        <Ionicons onPress={() => hideModal()} name="close" size={24} style={{ marginLeft: "auto" }} />
        <GalleryWrapper>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {
              allLineItemImages.length > 0 && allLineItemImages.map((item, i) =>
                <GalleryImageItem key={i} img={item} />
              )
            }

          </View>

          {
            allLineItemImages.length <= 0 &&
            <View style={{ padding: 16 }}>
              <Text style={{ fontFamily: 'URBAN_BOLD', fontSize: 16, textAlign: "center" }}>No Line Item images to Show</Text>
            </View>
          }

        </GalleryWrapper>
        <Text style={{ width: "100%", padding: 10, fontFamily: 'URBAN_MEDIUM', fontSize: 16, color: "#BDC5CD" }}>{title}</Text>
        <View style={{ padding: 16, flexDirection: 'row', justifyContent: "space-evenly", width: "100%" }}>
          <StyledOverlayText >QTY: {quantity}</StyledOverlayText>
          <StyledOverlayText style={{ flex: 1 }}>RATE: {getCurrencyFormattedValue(rate)}</StyledOverlayText>
          <StyledOverlayText style={{ flex: 1 }}>TOTAL: {getCurrencyFormattedValue(total)}</StyledOverlayText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: "100%", flexWrap: "wrap" }}>
          <StyledOverlayInputWrapper style={{ flexDirection: 'row' }}>
            <StyledOverlayInputLabel>ADJ QTY: </StyledOverlayInputLabel>
            <StyledOverlayInput
              keyboardType="number-pad"
              onChangeText={text => {
                if (text === "") { // * for negative numbers
                  return onOtherFormValueChange(0, "Adj_Quantity", UniqueKey)
                }
                onOtherFormValueChange(text, "Adj_Quantity", UniqueKey)
              }}
              value={`${Adj_Quantity ?? 0}`} />
          </StyledOverlayInputWrapper>
          <StyledOverlayInputWrapper style={{ flexDirection: 'row' }}>
            <StyledOverlayInputLabel>RATE: </StyledOverlayInputLabel>
            <StyledOverlayInput
              keyboardType="number-pad"
              onChangeText={text => {
                let formatdText = text.slice(2);
                if (!parseFloat(text.slice(2))) {
                  return;
                }
                onOtherFormValueChange(formatdText, "Adj_Rate", UniqueKey)
              }}
              value={`${getCurrencyFormattedValue(Adj_Rate) ?? 0}`} />
          </StyledOverlayInputWrapper>
          <StyledOverlayInputWrapper style={{ flexDirection: 'row' }}>
            <StyledOverlayInputLabel>TOTAL: </StyledOverlayInputLabel>
            <StyledOverlayInput editable={false} value={`${getCurrencyFormattedValue(total) ?? 0}`} />
          </StyledOverlayInputWrapper>
        </View>

        <View style={{ width: "100%", marginVertical: 8 }}>
          <Text style={{ fontSize: 16, fontFamily: 'URBAN_BOLD', color: '#BDC5CD', marginVertical: 8 }}>OWNER CLARIFICATIONS:</Text>
          <TextInput
            style={{ padding: 16, paddingLeft: 16, borderRadius: 4, backgroundColor: "#d4d4d470", fontFamily: 'URBAN_MEDIUM', fontSize: 16, color: "#BDC5CD" }}
            multiline
            numberOfLines={4}
            onChangeText={text => {
              console.log("TEXT: " + text);
              onOtherFormValueChange(text, "Owner_Clarification", UniqueKey)
            }}
            value={`${Owner_Clarification ?? ""}`}
          />
        </View>

        <View style={{ flexDirection: "row" }}>
          <Button onPress={() => hideModal()} mode="contained" labelStyle={{ fontSize: 18, fontFamily: 'URBAN_BOLD' }} style={{ backgroundColor: "#EF39A0", padding: 4 }}>Cancel</Button>
          <Button onPress={handleApproveAsNoted} mode="contained" labelStyle={{ fontSize: 18, fontFamily: 'URBAN_BOLD' }} style={{ backgroundColor: "#ABDF8C", padding: 4, marginLeft: 16 }}>Approve</Button>
        </View>

      </Overlay>
    </>
  )
}


function getCurrencyFormattedValue(value) {
  return value ? value?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0
}

function GalleryImageItem({ img }) {

  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <TouchableOpacity onPress={() => setShowPreview(true)}>
      <Image style={{
        width: Dimensions.get("window").width / 3,
        height: 128
      }} source={{ uri: img.file_public_url }} />
      <Overlay childrenWrapperStyle={{ backgroundColor: 'black' }} containerStyle={{ backgroundColor: 'black' }} visible={showPreview} onClose={() => setShowPreview(false)} closeOnTouchOutside >
        <Ionicons onPress={() => setShowPreview(false)} name="close" color="white" size={32} />
        <Image source={{ uri: img.file_public_url }} style={{ width: 480, height: 480, borderRadius: 16 }} />
      </Overlay>
    </TouchableOpacity>
  )
}


const GalleryWrapper = styled.View`
width: 100%;
`;


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
    return value;
  }
}


function CustomFormInput({ readOnly = false, onChangeText = () => { }, value, label, placeholder }) {

  const editable = !readOnly;

  return (
    <View style={{ width: '100%', flex: 1, marginHorizontal: 4 }}>
      <StyledTextInputLabel>{`${label}`}</StyledTextInputLabel>
      <StyledTextInput
        onChangeText={onChangeText}
        value={`${getFormattedValue(label, value) ?? 0}`}
        placeholder={placeholder}
        editable={editable}
      />
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
border-radius:50px;
`;

const StyledContractorText = styled(LineItemInputText)`
color: black;
font-family: 'URBAN_REGULAR';
font-size: 12px;
`;
