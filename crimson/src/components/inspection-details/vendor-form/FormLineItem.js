import styled from "styled-components/native";
import Overlay from 'react-native-modal-overlay';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button, Card, Portal, Provider } from "react-native-paper";
import Swipeable from 'react-native-swipeable';
import { View, TouchableOpacity, Text, TextInput, Image, Dimensions, Modal, Pressable, ScrollView } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign"
import { getVendorFormDetails } from "../../../services/inspections/inspections.service";
import ComposedGestureWrapper from "../../animated/ComposedGestureWrapper";
import Animated, { interpolateColor, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { showMessage } from "react-native-flash-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";



let requiredSubCategories = [
  "Off Matrix - Pool",
  "Off Matrix - Exterior",
  "Off Matrix - Interior",
  "Off Matrix - MEP"
]


export default function FormLineItem({ isSubmittedByReviewer, handleAcceptLineItem, isSubmitted, isForReviewerView, inspId, item, onRoomMeasurementValueChange, onOtherFormValueChange, isForRoomMeasurement, deleteNewItem, navigation, readOnly, setShowAddButton, handleOnSave, setIsEditModalClosed }) {
  const [overlayVisible, setOverlayVisible] = React.useState(false)

  const handleDelGest = (Id, inspId, UniqueKey) => {
    handleDelete(Id, inspId, UniqueKey);
    swipeableRef.current.recenter();
  }

  useEffect(() => {
    setIsEditModalClosed(overlayVisible)
  }, [overlayVisible])

  const insets = useSafeAreaInsets()

  const rightButtons = [
    <TouchableOpacity onPress={() => handleDelGest(item.Id, inspId, item.UniqueKey)} style={{ backgroundColor: '#F3206F', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
      <View>
        <MaterialCommunityIcons name="delete" size={24} color="white" />
        {/* <Text>Delete</Text> */}
      </View>
    </TouchableOpacity>
  ];

  const swipeableRef = React.useRef();

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
    return <SubmittedFormLineItem {...{ status: item?.Approval_Status, title: item.Matrix_Price, rate: item.Rate, quantity: item.Quantity, notes: item.Scope_Notes, adjQuantity: item.Adj_Quantity, adjRate: item.Adj_Rate, approvedAmt: item.Approved_Amount, ownerClarification: item.Owner_Clarification }} />
  }

  if (isForRoomMeasurement) {
    return <RoomMeasurementLineItem {...{ item, handleOnSave, onRoomMeasurementValueChange, setOverlayVisible, overlayVisible, readOnly, swipeableRef, isSubmittedByReviewer }} />
  }

  if (isForReviewerView) {
    return (
      <ContractorViewLineItem {...{ swipeableRef, insets, inspId, isSubmittedByReviewer, handleAcceptLineItem, item, onOtherFormValueChange, setIsEditModalClosed }} />
    )

  }

  return (
    <OtherFormLineItems {...{ Sub_Category_Keys, item, readOnly, handleOnSave, onOtherFormValueChange, setOverlayVisible, overlayVisible, swipeableRef }} />
  )

}

function OtherFormLineItems({ Sub_Category_Keys, item, readOnly, handleOnSave, onOtherFormValueChange, setOverlayVisible, overlayVisible, swipeableRef }) {

  const offset = useSharedValue({ x: 0 });
  const start = useSharedValue({ x: 0 });

  const [show, setShow] = React.useState(false);

  const handleLongPressState = (state) => {
    setShow(state);
  }


  const longPressGesture = Gesture.LongPress()
    .onEnd(() => {
      runOnJS(handleLongPressState)(true)
    })



  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      console.log(e.translationX);
      offset.value = {
        x: (e.translationX + start.value.x)
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
      };
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
      ],
    };
  });


  const obj = useDerivedValue(() => {
    if (offset.value.x < 0) {
      return {
        color: "red",
        limit: -200
      }
    }
    if (offset.value.x > 0) {
      return {
        color: "green",
        limit: 100
      }
    }
  }, [offset.value.x])

  const animatedStyleforBackground = useAnimatedStyle(() => {

    let bColor = "#c4c4c490";

    if (obj.value) {
      bColor = interpolateColor(offset.value.x, [0, obj.value.limit], ["#c4c4c490", obj.value.color])
    }

    return {
      backgroundColor: bColor,
    }
  });

  const handleAlert = () => {

    if (offset.value.x < -100 && offset.value.x > -200) {
      if (readOnly) {
        setOverlayVisible(false);
        offset.value = {
          x: 0
        }
        start.value = {
          x: 0
        }
        setShow(false)
        return;
      }
      console.log("INSIDE CANCEL");
      // refreshCOData()// * Reset Old Data
      setOverlayVisible(false);
      showMessage({
        message: "Discarding changes...",
        type: "danger",
      });
      offset.value = {
        x: 0
      }
      start.value = {
        x: 0
      }
      setShow(false)
    }
    if (offset.value.x > 100) {
      if (readOnly) {
        setOverlayVisible(false);
        offset.value = {
          x: 0
        }
        start.value = {
          x: 0
        }
        setShow(false)
        return;
      }
      console.log("SAVING..");
      item && handleOnSave(item); // * Call SAVE TO CONTEXT FUNCTION
      setOverlayVisible(false);
      showMessage({
        message: "Saving Changes...",
        type: "success",
      });
      offset.value = {
        x: 0
      }
      start.value = {
        x: 0
      }
      setShow(false)
    }


  }

  useDerivedValue(() => {

    if ((offset.value.x > 100) || (offset.value.x < 0 && offset.value.x > -200)) {
      runOnJS(handleAlert)(offset.value.x)
    }

  }, [offset.value.x, item])



  const composed = Gesture.Simultaneous(longPressGesture, dragGesture);




  return (
    <>
      {item?.Matrix_Price && item?.Matrix_Price.length > 0 &&
        <Swipeable onRef={(ref) => swipeableRef.current = ref} rightButtons={Sub_Category_Keys.includes(item?.Sub_Category) ? rightButtons : null}>
          <LineItemWrapper onPress={() => setOverlayVisible(true)} >
            <View style={{ flex: 1 }}>
              {
                <LineItemHeading>
                  {item?.Matrix_Price}
                </LineItemHeading>
              }
              <LineItemInputGroup>
                {/* QTY */}
                <LineItemInputText>Qty {item.Quantity}</LineItemInputText>
                {/* RATE */}
                <LineItemInputText >Rate {getFormattedValue("Rate", item.Rate)}</LineItemInputText>
                {/* NOTES */}
                <LineItemInputText >Total {getFormattedValue("Total", item.Total)}</LineItemInputText>
              </LineItemInputGroup>
            </View>
            {/* Icon */}
            {
              !readOnly &&
              <Ionicons name="camera" onPress={() => navigation.navigate("CameraScreen", { inspId: { inspId }, lineItemId: item.Id })} size={24} />
            }

          </LineItemWrapper>
        </Swipeable>
      }
      <Modal transparent visible={overlayVisible} onClose={() => overlayVisible(false)} >
        <ComposedGestureWrapper gesture={composed}>
          <>
            {/* MESSAGE */}
            {
              show &&
              <Animated.View style={{ position: 'absolute', bottom: 120, width: "100%", paddingHorizontal: 12 }}>
                <Animated.View style={{ marginLeft: "auto", justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Up to save</Text>
                </Animated.View>
                <Animated.View style={{ marginRight: "auto", justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Down to Cancel</Text>
                </Animated.View>
              </Animated.View>
            }
            <Animated.View style={[{ backgroundColor: "#d4d4d490", flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 36 }, animatedStyleforBackground]}>

              <Animated.View style={[{ backgroundColor: "white", padding: 12, width: "100%", borderRadius: 8 }, animatedStyles]}>
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
                <View>
                  <FormLabel style={{ fontSize: 12 }}>Scope Notes</FormLabel>
                  <View>
                    <TextInput
                      multiline
                      value={item.Scope_Notes}
                      onChangeText={(text) => onOtherFormValueChange(text, "Scope_Notes", item.UniqueKey)}
                      style={{ padding: 10, height: 96, backgroundColor: "#f1f4f8", borderRadius: 8 }}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Qty</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onOtherFormValueChange(text, "Quantity", item.UniqueKey)
                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${item.Quantity ?? 0}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>U_M</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onOtherFormValueChange(text, "U_M", item.UniqueKey)
                    }} style={{ fontSize: 16 }} value={`${item.U_M ?? ''}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Rate</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onOtherFormValueChange(text, "Rate", item.UniqueKey)
                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${item.Rate ?? 0}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Total</FormLabel>
                    <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{`${item.Total ?? 0}`} </FormValue>
                  </View>
                </View>
              </Animated.View>
            </Animated.View>
          </>
        </ComposedGestureWrapper>
      </Modal>
    </>

  )
}

function SubmittedFormLineItem({ status, title, rate, quantity, total, notes, adjQuantity, adjRate, approvedAmt, ownerClarification }) {
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

  let showRate = adjRate;
  let showQuantity = adjQuantity;
  let showAmount = approvedAmt;

  const [showWAPopup, setShowWAPopup] = React.useState(false);


  return (
    <>
      <Card onPress={() => setShowWAPopup(true)} style={{ padding: 12, backgroundColor: getCardBackgroundColor(), borderBottomWidth: 2, borderColor: '#EEBC7B' }}>
        <View style={{ alignSelf: 'flex-start', marginVertical: 4, padding: 8, borderRadius: 8, backgroundColor: getBackgroundColor() }}>
          <Text style={{ fontSize: 12, fontFamily: 'URBAN_BOLD' }}>{status}</Text>
        </View>
        <LineItemHeading style={{ fontFamily: 'URBAN_BOLD' }}>{title}</LineItemHeading>
        <LineItemHeading style={{}}>Scope Notes : {notes}</LineItemHeading>
        <View >
          {/* Details */}
          <View style={{ flexDirection: 'row' }}>
            <StyledContractorText style={{ flex: 1, fontSize: 14, }}>QTY: {quantity}</StyledContractorText>
            <StyledContractorText style={{ flex: 1, fontSize: 14, }} >RATE: {rate ? rate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
            <StyledContractorText style={{ flex: 1, fontSize: 14, }}>TOTAL: {total ? total?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <StyledContractorText style={{ flex: 1, fontSize: 18, fontFamily: 'URBAN_MEDIUM' }}>ADJ QTY: {showQuantity}</StyledContractorText>
            <StyledContractorText style={{ flex: 1, fontSize: 18, fontFamily: 'URBAN_MEDIUM' }} >RATE: {showRate ? showRate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
            <StyledContractorText style={{ flex: 1, fontSize: 18, fontFamily: 'URBAN_MEDIUM' }}>TOTAL: {showAmount ? showAmount?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
          </View>
        </View>
      </Card>
      {/* Popup Modal */}
      <Modal transparent visible={showWAPopup} onDismiss={() => setShowWAPopup(false)}>
        <View style={{ flex: 1, backgroundColor: "#d4d4d470", paddingHorizontal: 32, justifyContent: "center", alignItems: "center" }}>
          <Pressable style={{ marginLeft: "auto" }} onPress={() => setShowWAPopup(false)}>
            <Ionicons name="close" size={32} color={"black"} />
          </Pressable>
          <View style={{ backgroundColor: "white", borderRadius: 8, padding: 16, width: "100%" }}>
            <View>
              <Text style={{ fontFamily: "URBAN_BOLD" }}>Scope Notes</Text>
              <TextInput
                editable={false}
                multiline
                value={notes}
                style={{ height: 96, fontFamily: "URBAN_REGULAR" }}
              />
            </View>
            <View>
              <Text style={{ fontFamily: "URBAN_BOLD" }}>Owner Clarification</Text>
              <TextInput
                editable={false}
                multiline
                value={ownerClarification}
                style={{ padding: 10, height: 96 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>


  )
}

function RoomMeasurementLineItem({ item, handleOnSave, onRoomMeasurementValueChange, setOverlayVisible, overlayVisible, readOnly, swipeableRef, isSubmittedByReviewer }) {

  let length, width, misc, total;
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
  total = getFormatedRowValues(item.Room_Total);

  const offset = useSharedValue({ x: 0 });
  const start = useSharedValue({ x: 0 });

  const [show, setShow] = React.useState(false);

  const handleLongPressState = (state) => {
    setShow(state);
  }


  const longPressGesture = Gesture.LongPress()
    .onEnd(() => {
      runOnJS(handleLongPressState)(true)
    })



  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      console.log(e.translationX);
      offset.value = {
        x: (e.translationX + start.value.x)
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
      };
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
      ],
    };
  });


  const obj = useDerivedValue(() => {
    if (offset.value.x < 0) {
      return {
        color: "red",
        limit: -200
      }
    }
    if (offset.value.x > 0) {
      return {
        color: "green",
        limit: 100
      }
    }
  }, [offset.value.x])

  const animatedStyleforBackground = useAnimatedStyle(() => {

    let bColor = "#c4c4c490";

    if (obj.value) {
      bColor = interpolateColor(offset.value.x, [0, obj.value.limit], ["#c4c4c490", obj.value.color])
    }

    return {
      backgroundColor: bColor,
    }
  });

  const handleAlert = () => {

    if (offset.value.x < -100 && offset.value.x > -200) {
      if (isSubmittedByReviewer) {
        setOverlayVisible(false);
        offset.value = {
          x: 0
        }
        start.value = {
          x: 0
        }
        setShow(false)
        return;
      }
      console.log("INSIDE CANCEL");
      // refreshCOData()// * Reset Old Data
      setOverlayVisible(false);
      showMessage({
        message: "Discarding changes...",
        type: "danger",
      });
      offset.value = {
        x: 0
      }
      start.value = {
        x: 0
      }
      setShow(false)
    }
    if (offset.value.x > 100) {
      if (isSubmittedByReviewer) {
        setOverlayVisible(false);
        offset.value = {
          x: 0
        }
        start.value = {
          x: 0
        }
        setShow(false)
        return;
      }
      console.log("SAVING..");
      item && handleOnSave(true, item);; // * Call SAVE TO CONTEXT FUNCTION
      setOverlayVisible(false);
      showMessage({
        message: "Saving Changes...",
        type: "success",
      });
      offset.value = {
        x: 0
      }
      start.value = {
        x: 0
      }
      setShow(false)
    }


  }

  useDerivedValue(() => {

    if ((offset.value.x > 100) || (offset.value.x < 0 && offset.value.x > -200)) {
      runOnJS(handleAlert)(offset.value.x)
    }

  }, [offset.value.x, item])


  const composed = Gesture.Simultaneous(longPressGesture, dragGesture);

  return (
    <>
      <Swipeable onRef={(ref) => swipeableRef.current = ref}>
        <LineItemWrapper onPress={() => setOverlayVisible(true)} >
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
              <LineItemInputText>Length: {length}</LineItemInputText>
              {/* Width */}
              <LineItemInputText>Width: {width}</LineItemInputText>
              {/* Misc */}
              <LineItemInputText>Misc: {misc}</LineItemInputText>
              {/* Total */}
              <LineItemInputText>Total: {total} sqft</LineItemInputText>
            </LineItemInputGroup>
          </View>
        </LineItemWrapper>
      </Swipeable>


      <Modal transparent visible={overlayVisible} onClose={() => setOverlayVisible(false)} >
        <ComposedGestureWrapper gesture={composed}>
          <>
            {/* MESSAGE */}
            {
              show &&
              <Animated.View style={{ position: 'absolute', bottom: 120, width: "100%", paddingHorizontal: 12 }}>
                <Animated.View style={{ marginLeft: "auto", justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Up to save</Text>
                </Animated.View>
                <Animated.View style={{ marginRight: "auto", justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Down to Cancel</Text>
                </Animated.View>
              </Animated.View>
            }
            <Animated.View style={[{ backgroundColor: "#d4d4d490", flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 36 }, animatedStyleforBackground]}>

              <Animated.View style={[{ backgroundColor: "white", padding: 12, width: "100%", borderRadius: 8 }, animatedStyles]}>
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

                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Length</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onRoomMeasurementValueChange(text, "Room_Length", item.UniqueKey)
                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${length ?? 0}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Width</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onRoomMeasurementValueChange(text, "Room_Width", item.UniqueKey)
                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${width ?? ''}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Misc</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onRoomMeasurementValueChange(text, "Room_Misc_SF", item.UniqueKey)
                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${misc ?? 0}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Total</FormLabel>
                    <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{`${total ?? 0}`} </FormValue>
                  </View>
                </View>
              </Animated.View>
            </Animated.View>
          </>
        </ComposedGestureWrapper>
      </Modal>

    </>

  )

}

function ContractorViewLineItem({ swipeableRef, insets, inspId, isSubmittedByReviewer, handleAcceptLineItem, item, onOtherFormValueChange, setIsEditModalClosed }) {

  const {
    UniqueKey,
    Adj_Quantity,
    Adj_Rate,
    Adj_U_M,
    Owner_Clarification,
    Approved_Amount,
    Id: id,
    Matrix_Price: title,
    Rate,
    Quantity,
    Total,
    Approval_Status,
    Scope_Notes,
    U_M,
  } = item

  //  * GET LINE ITEM IMAGES 
  // // TODO - getting all images , select only line item imagess
  const [allLineItemImages, setAllLineImages] = React.useState([]);

  async function getLineItemImages() {
    const data = await getVendorFormDetails(inspId);
    const filterImages = data?.Images?.filter(image => image.file_name.includes(id))
    setAllLineImages(filterImages ?? [])
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

  useEffect(() => {
    setIsEditModalClosed(visible)
  }, [visible])

  function acceptLineItem() {
    setSelectedStatus("Approved");
    item && handleAcceptLineItem(id, "Approved", item);
  }

  function reviewLineItem() {
    showModal();
  }

  function deleteLineItem() {
    setSelectedStatus("Declined");
    item && handleAcceptLineItem(id, "Declined", item);
  }

  function handleApproveAsNoted() {
    setSelectedStatus("Approved as Noted");
    item && handleAcceptLineItem(id, "Approved as Noted", item);
    hideModal();
  }

  //remove below function after verification
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
  //remove code after verification
  function isDisabled(status) {
    return isSubmittedByReviewer || selectedStatus === status;
  }


  const offset = useSharedValue({ x: 0 });
  const start = useSharedValue({ x: 0 });

  const [show, setShow] = React.useState(false);

  const handleLongPressState = (state) => {
    setShow(state);
  }


  const longPressGesture = Gesture.LongPress()
    .onEnd(() => {
      runOnJS(handleLongPressState)(true)
    })



  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      console.log(e.translationX);
      offset.value = {
        x: (e.translationX + start.value.x)
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
      };
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
      ],
    };
  });


  const obj = useDerivedValue(() => {
    if (offset.value.x < 0) {
      return {
        color: "red",
        limit: -200
      }
    }
    if (offset.value.x > 0) {
      return {
        color: "green",
        limit: 100
      }
    }
  }, [offset.value.x])

  const animatedStyleforBackground = useAnimatedStyle(() => {

    let bColor = "#c4c4c490";

    if (obj.value) {
      bColor = interpolateColor(offset.value.x, [0, obj.value.limit], ["#c4c4c490", obj.value.color])
    }

    return {
      backgroundColor: bColor,
    }
  });

  const handleAlert = () => {

    if (offset.value.x < -100 && offset.value.x > -200) {
      if (isSubmittedByReviewer) {
        setVisible(false);
        offset.value = {
          x: 0
        }
        start.value = {
          x: 0
        }
        setShow(false)
        return;
      }
      console.log("INSIDE CANCEL");
      // refreshCOData()// * Reset Old Data
      setVisible(false);
      showMessage({
        message: "Discarding changes...",
        type: "danger",
      });
      offset.value = {
        x: 0
      }
      start.value = {
        x: 0
      }
      setShow(false)
    }
    if (offset.value.x > 100) {
      if (isSubmittedByReviewer) {
        setVisible(false);
        offset.value = {
          x: 0
        }
        start.value = {
          x: 0
        }
        setShow(false)
        return;
      }
      console.log("SAVING..");
      item && handleApproveAsNoted(); // * Call SAVE TO CONTEXT FUNCTION
      setVisible(false);
      showMessage({
        message: "Saving Changes...",
        type: "success",
      });
      offset.value = {
        x: 0
      }
      start.value = {
        x: 0
      }
      setShow(false)
    }


  }

  useDerivedValue(() => {

    if ((offset.value.x > 100) || (offset.value.x < 0 && offset.value.x > -200)) {
      runOnJS(handleAlert)(offset.value.x)
    }

  }, [offset.value.x, item])



  const composed = Gesture.Simultaneous(longPressGesture, dragGesture);


  const [showReviewerImagePopover, setShowReviewerImagePopover] = React.useState(false);

  const rightButtonsForReviwerSubmit = [
    <TouchableOpacity onPress={() => setShowReviewerImagePopover(true)} style={{ backgroundColor: '#1d1f69', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
      <View>
        <MaterialCommunityIcons name="image-multiple" size={24} color="white" />
      </View>
    </TouchableOpacity>
  ];



  return (
    <>
      {title && title.length > 0 &&
        <Swipeable onRef={(ref) => swipeableRef.current = ref} rightButtons={rightButtonsForReviwerSubmit}>
          <Card style={{ padding: 16, backgroundColor: getBackgroundColor(), borderBottomWidth: 2, borderColor: '#EEBC7B' }}>
            <LineItemHeading>{title}</LineItemHeading>
            {/* <LineItemHeading>{item.Approval_Status}</LineItemHeading> */}
            <LineItemHeading>Scope Notes : {Scope_Notes}</LineItemHeading>
            <View style={{ flexDirection: 'row' }}>
              {/* Details */}
              <View style={{ flex: .4 }}>
                <StyledContractorText>QTY: {Quantity}</StyledContractorText>
                <StyledContractorText>RATE: {getCurrencyFormattedValue(Rate)}</StyledContractorText>
                <StyledContractorText>TOTAL: {getCurrencyFormattedValue(Total)}</StyledContractorText>
              </View>
              <View style={{ flex: .6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <StyledContractorButton
                  labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }}
                  disabled={Approval_Status === "Approved"}
                  backgroundColor={Approval_Status === "Approved" ? "grey" : "#7CDD9B"}
                  mode="contained"
                  onPress={() => acceptLineItem()}>
                  A
                </StyledContractorButton>
                <StyledContractorButton
                  labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }}
                  disabled={Approval_Status === "Approved as Noted"}
                  backgroundColor={Approval_Status === "Approved as Noted" ? "grey" : "#3983EF"}
                  mode="contained"
                  onPress={() => reviewLineItem()}>
                  R
                </StyledContractorButton>
                <StyledContractorButton
                  labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }}
                  disabled={Approval_Status === "Declined"}
                  backgroundColor={Approval_Status === "Declined" ? "grey" : "#E02E2E"}
                  mode="contained"
                  onPress={() => deleteLineItem()}>
                  D
                </StyledContractorButton>
              </View>
            </View>
          </Card>
        </Swipeable>
      }

      <Modal transparent visible={showReviewerImagePopover} onDismiss={() => setShowReviewerImagePopover(false)} >

        <View style={{ backgroundColor: "#c4c4c490", flex: 1, justifyContent: "center", alignItems: "center", }}>
          <MaterialCommunityIcons onPress={() => setShowReviewerImagePopover(false)} name="close" size={24} style={{ position: "absolute", top: 240, right: 48 }} />
          <View style={{ flexDirection: "row", paddingHorizontal: 24 }}>
            {
              allLineItemImages.length > 0
                ? allLineItemImages.map((img, key) => <PopoverImageItem key={key} img={img} />)
                : <Text style={{ backgroundColor: "black", color: "white", padding: 8, fontFamily: "URBAN_BOLD" }}>No images to preview</Text>
            }
          </View>
        </View>

      </Modal>

      <Modal transparent visible={visible} onClose={() => setVisible(false)} >
        <ComposedGestureWrapper gesture={composed}>
          <>
            {/* MESSAGE */}
            {
              show &&
              <Animated.View style={{ position: 'absolute', bottom: 120, width: "100%", paddingHorizontal: 12 }}>
                <Animated.View style={{ marginLeft: "auto", justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Up to save</Text>
                </Animated.View>
                <Animated.View style={{ marginRight: "auto", justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Down to Cancel</Text>
                </Animated.View>
              </Animated.View>
            }
            <Animated.View style={[{ backgroundColor: "#d4d4d490", flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 36 }, animatedStyleforBackground]}>

              {/* Fixed Banner */}
              <View style={{ padding: 8, paddingTop: insets.top, position: "absolute", top: 0, backgroundColor: "#000", width: Dimensions.get("screen").width }}>
                <View>
                  <FormLabel style={{ fontSize: 12, color: "white", fontFamily: "URBAN_BOLD" }}>Scope Notes</FormLabel>
                  <ScrollView showsVerticalScrollIndicator style={{ height: 26, marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, color: "white", fontFamily: "URBAN_BOLD" }}>{Scope_Notes}</Text>
                  </ScrollView>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12, color: "white" }}>Qty</FormLabel>
                    <FormValue >{`${Quantity}`} </FormValue>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12, color: "white" }}>UM</FormLabel>
                    <FormValue >{`${U_M ?? ''}`}</FormValue>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12, color: "white" }}>Rate</FormLabel>
                    <FormValue >{`${Rate}`}</FormValue>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12, color: "white" }}>Total</FormLabel>
                    <FormValue >{`${Total}`}</FormValue>
                  </View>
                </View>
              </View>

              <Animated.View style={[{ backgroundColor: "white", padding: 12, width: "100%", borderRadius: 8 }, animatedStyles]}>

                <View>
                  <FormLabel style={{ fontSize: 12 }}>Owner Clarification</FormLabel>
                  <View
                    style={{
                      backgroundColor: "#f1f4f8",
                      borderRadius: 8

                    }}>
                    <TextInput
                      editable
                      multiline
                      onChangeText={(text) => {
                        onOtherFormValueChange(text, "Owner_Clarification", UniqueKey)
                      }}
                      value={Owner_Clarification}
                      style={{ padding: 10, height: 96, backgroundColor: "#f1f4f8", borderRadius: 8 }}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Adj Qty</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onOtherFormValueChange(text, "Adj_Quantity", UniqueKey)
                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${Adj_Quantity ?? 0}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Adj UM</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onOtherFormValueChange(text, "Adj_U_M", UniqueKey)
                    }} style={{ fontSize: 16 }} value={`${Adj_U_M ?? ''}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Adj Rate</FormLabel>
                    <FormInput onChangeText={(text) => {
                      onOtherFormValueChange(text, "Adj_Rate", UniqueKey)
                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${Adj_Rate ?? 0}`} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 2 }}>
                    <FormLabel style={{ fontSize: 12 }}>Appr. Amt</FormLabel>
                    <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{`${Approved_Amount ?? 0}`} </FormValue>
                  </View>
                </View>
              </Animated.View>
            </Animated.View>
          </>
        </ComposedGestureWrapper>
      </Modal>

    </>
  )
}

function PopoverImageItem({ img }) {

  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <TouchableOpacity onPress={() => setShowPreview(true)}>
      <Image
        source={{ uri: img.file_public_url }}
        style={{
          width: (Dimensions.get("window").width / 3) - 24,
          height: 128
        }} />
      <Overlay childrenWrapperStyle={{ backgroundColor: 'black' }} containerStyle={{ backgroundColor: 'black' }} visible={showPreview} onClose={() => setShowPreview(false)} closeOnTouchOutside >
        <Ionicons onPress={() => setShowPreview(false)} name="close" color="white" size={32} />
        <Image source={{ uri: img.file_public_url }} style={{ width: 480, height: 480, borderRadius: 16 }} />
      </Overlay>
    </TouchableOpacity>
  )
}

function getCurrencyFormattedValue(value) {
  return value ? value?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0
}

function GalleryImageItem({ img }) {

  const [showPreview, setShowPreview] = React.useState(false);

  let w = Dimensions.get("window").width / 6;
  let h = Dimensions.get("window").width / 6;

  return (
    <TouchableOpacity onPress={() => setShowPreview(true)}>
      <Image style={{
        width: w,
        height: h,
        margin: 2
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
font-size: 16px;
`;
const StyledOverlayInput = styled.TextInput`
color: #EEC690;
font-family: URBAN_BOLD;
font-size: 20px;
`;

const FormLabel = styled.Text`
font-family: 'URBAN_BOLD';
font-size: ${Platform.OS === "android" ? 12 : 16}px;
margin-bottom: 4px;
`

const FormInput = styled.TextInput`
background-color: #f1f4f8;
padding: 8px;
font-family: 'URBAN_MEDIUM';
border-radius: 4px;
`;

const FormValue = styled.Text`
font-family: 'URBAN_MEDIUM';
color: #fff;
font-size: 18px;
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


function CustomFormInput({ readOnly = false, onChangeText = () => { }, value, label, placeholder, keyboardType = "number-pad" }) {

  const editable = !readOnly;

  return (
    <View style={{ width: '100%', flex: 1, marginHorizontal: 4 }}>
      <StyledTextInputLabel>{label === "Total" ? `${label} ($)` : `${label}`}</StyledTextInputLabel>
      <StyledTextInput
        onChangeText={onChangeText}
        value={`${value}`}
        placeholder={placeholder}
        editable={editable}
        keyboardType={keyboardType}
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
margin-right: 8px;

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
