import styled from "styled-components/native";
import Overlay from 'react-native-modal-overlay';
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button, Card, Portal, Provider } from "react-native-paper";
import Swipeable from 'react-native-swipeable';
import { View, TouchableOpacity, Modal, Text, TextInput, Image, Dimensions } from 'react-native'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, {useEffect} from "react";
import { getVendorFormDetails } from "../../../services/inspections/inspections.service";
import ComposedGestureWrapper from "../../animated/ComposedGestureWrapper";
import Animated, { interpolateColor, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated";
import { showMessage } from "react-native-flash-message";
import LottieView from 'lottie-react-native';
import { Gesture } from "react-native-gesture-handler";


let requiredSubCategories = [
  "Off Matrix - Pool",
  "Off Matrix - Exterior",
  "Off Matrix - Interior",
  "Off Matrix - MEP"
]


export default function FormLineItem({ isSubmittedByReviewer, handleAcceptLineItem, isSubmitted, isForReviewerView, inspId, item, onRoomMeasurementValueChange, onOtherFormValueChange, isForRoomMeasurement, deleteNewItem, navigation, readOnly, setShowAddButton, handleOnSave,setIsEditModalClosed }) {
  const [overlayVisible, setOverlayVisible] = React.useState(false)

  const handleDelGest = (Id, inspId, UniqueKey) => {
    handleDelete(Id, inspId, UniqueKey);
    swipeableRef.current.recenter();
  }

  useEffect(()=>{
    setIsEditModalClosed(overlayVisible)
  },[overlayVisible])


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
    return <SubmittedFormLineItem {...{ status: item?.Approval_Status, title: item.Matrix_Price, rate: item.Rate, quantity: item.Quantity, notes: item.Scope_Notes, adjQuantity: item.Adj_Quantity, adjRate: item.Adj_Rate, approvedAmt: item.Approved_Amount }} />
  }

  if (isForRoomMeasurement) {

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


    const animation = React.useRef(null);

    React.useEffect(() => {
      animation.current?.reset();
      animation.current?.play();
    }, []);


    const offset = useSharedValue({ x: 0 });
    const start = useSharedValue({ x: 0 });

    const [show, setShow] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);

    const handleLongPressState = (state) => {
      setShow(state);
    }


    const longPressGesture = Gesture.LongPress()
      .onEnd(() => {
        // console.log("LP");
        runOnJS(handleLongPressState)(true)
      })



    const dragGesture = Gesture.Pan()
      .averageTouches(true)
      .onUpdate((e) => {
        offset.value = {
          x: (e.translationY + start.value.x)
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
          { translateY: offset.value.x },
        ],
      };
    });


    const obj = useDerivedValue(() => {
      if (offset.value.x > 0) {
        return {
          color: "red",
          limit: 180
        }
      }
      if (offset.value.x < 0) {
        return {
          color: "green",
          limit: -180
        }
      }
    }, [offset.value.x])

    const animatedStyleforBackground = useAnimatedStyle(() => {

      let bColor = "#c4c4c490";

      if (obj.value) {
        bColor = interpolateColor(offset.value.x, [0, obj.value.limit], ["grey", obj.value.color])
      }

      return {
        backgroundColor: bColor,
      }
    });


    const handleAlert = (v) => {
      if (v < -20 && v > -40) {
        console.log({item});
        item && handleOnSave(true,item);
        setOverlayVisible(false);
        showMessage({
          message: "Saved",
          type: "success",
        });
        offset.value = {
          x: 0
        }
        start.value = {
          x: 0
        }
        setShow(false)
        // console.log({ temp })  // * Call SAVE TO CONTEXT FUNCTION
      }
      
      if (v > 40) {
        setOverlayVisible(false);
        showMessage({
          message: "Cancelled",
          type: "default",
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
      if (offset.value.x > 40 || (offset.value.x < 0 && offset.value.x > -40)) {
        runOnJS(handleAlert)(offset.value.x)
      }

    }, [offset.value.x,item])



    const composed = Gesture.Simultaneous(longPressGesture, dragGesture);

    const [temp, setTemp] = React.useState({
      Sub_Category: item.Sub_Category,
      Room_Length: length,
      Room_Width: width,
      Room_Misc_SF: misc
    })

    const handleTempValueChange = (key, value) => {
      console.log({ key, value });
      setTemp(prev => {
        return {
          ...prev,
          [key]: value
        }
      })
    }




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
      
        <Modal transparent visible={overlayVisible} onDismiss={() => setOverlayVisible(false)}>
          <ComposedGestureWrapper gesture={composed}>
            <Animated.View style={{ flex: 1 }}>
              <Animated.View style={[{ backgroundColor: "white", height: "100%", justifyContent: 'center', alignItems: 'center', padding: 16 }, animatedStyleforBackground]}>
                {
                  show &&
                  <Animated.View style={{ position: 'absolute', bottom: 100, width: "100%", paddingHorizontal: 12 }}>
                    <Animated.View style={{ marginLeft: "auto", justifyContent: 'center', alignItems: 'center', }}>
                      <Text style={{ color: "#8477EB", fontFamily: "URBAN_BOLD", fontSize: 20 }}>Swipe right to save</Text>
                      <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: 'transparent',
                        }}
                        source={require('../../../../assets/animations/swipe-right.json')}
                      />
                    </Animated.View>
                    <Animated.View style={{ marginRight: "auto", justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: "#8477EB", fontFamily: "URBAN_BOLD", fontSize: 20 }}>Swipe left to Cancel</Text>
                      <LottieView
                        autoPlay
                        ref={animation}
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: 'transparent',
                        }}
                        source={require('../../../../assets/animations/swipe-left.json')}
                      />
                    </Animated.View>
                  </Animated.View>
                }
                <Animated.View style={[{ width: "100%", backgroundColor: "white", padding: 16, borderRadius: 8 }, animatedStyles]}>
                  {
                    (Sub_Category_List.includes(item.Sub_Category) || readOnly)
                      ?
                      <StyledText>{item.Sub_Category}</StyledText>
                      :
                      <StyledTextInput
                        onChangeText={val => onRoomMeasurementValueChange((val), "Sub_Category", item.UniqueKey)}
                        value={`${item.Sub_Category}`}
                        // onChangeText={val => handleTempValueChange("Sub_Category", val)}
                        // value={`${temp.Sub_Category}`}
                      />
                  }
                  <View style={[{ flexDirection: 'row' }]}>
                    <CustomFormInput
                      label="Length"
                      placeholder="Length"
                      onChangeText={val => {
                        if (val === "") { // * for negative numbers
                          return onRoomMeasurementValueChange(0, "Room_Length", item.UniqueKey)
                        }
                        onRoomMeasurementValueChange((val), "Room_Length", item.UniqueKey)
                      }}
                      readOnly={readOnly}
                      value={length ?? 0}
                      // onChangeText={val => handleTempValueChange("Room_Length", val)}
                      // value={`${temp.Room_Length}`}

                    />

                    <CustomFormInput
                      label="Width"
                      placeholder="Width"
                      onChangeText={val => {
                        if (val === "") { // * for negative numbers
                          return onRoomMeasurementValueChange(0, "Room_Width", item.UniqueKey)
                        }
                        onRoomMeasurementValueChange((val), "Room_Width", item.UniqueKey)
                      }}
                      readOnly={readOnly}
                      value={width ?? 0}
                      // onChangeText={val => handleTempValueChange("Room_Width", val)}
                      // value={`${temp.Room_Width}`}
                    />
                    <CustomFormInput
                      label="Misc"
                      placeholder="Misc"
                      onChangeText={val => {
                        if (val === "") { // * for negative numbers
                          return onRoomMeasurementValueChange(0, "Room_Misc_SF", item.UniqueKey)
                        }
                        onRoomMeasurementValueChange((val), "Room_Misc_SF", item.UniqueKey)
                      }} 
                      readOnly={readOnly}
                      value={misc ?? 0}
                      // onChangeText={val => handleTempValueChange("Room_Misc_SF", val)}
                      // value={`${temp.Room_Misc_SF}`}
                    />
                    <CustomFormInput
                      label="Total SqFt"
                      placeholder="Total"
                      readOnly={true}
                      value={total}
                    />

                  </View>
                </Animated.View>
                {/* Instructions */}
                {/* <View style={{ position: "absolute", bottom: 120, width: "100%" }}>
                  <Text style={{ marginLeft: "auto", padding: 8, fontSize: 16, backgroundColor: "#8477EB", color: "white", fontFamily: "URBAN_BOLD" }}>Swipe Right to Save</Text>
                  <Text style={{ marginRight: "auto", padding: 8, fontSize: 16, backgroundColor: "#8477EB", color: "white", fontFamily: "URBAN_BOLD", marginTop: 36 }}>Swipe Left to Cancel</Text>
                </View> */}
              </Animated.View>
            </Animated.View>
          </ComposedGestureWrapper>
        </Modal>
      </>

    )

  }

  if (isForReviewerView) {
    return (
      <ContractorViewLineItem {...{ inspId, isSubmittedByReviewer, handleAcceptLineItem, item, onOtherFormValueChange,setIsEditModalClosed }} />
    )

  }


  return (
    <>
      {item?.Matrix_Price && item?.Matrix_Price.length >0 &&  
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
      <Overlay visible={overlayVisible} onClose={() => setOverlayVisible(false)} >
        <Ionicons style={{ marginLeft: "auto" }} onPress={() => setOverlayVisible(false)} name="close" size={24} />
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
            onChangeText={text => {
              if (text === "") { // * for negative numbers
                return onOtherFormValueChange(0, "Quantity", item.UniqueKey)
              }
              onOtherFormValueChange(text, "Quantity", item.UniqueKey)
            }}
            // onChangeText={val => onOtherFormValueChange((val), "Quantity", item.UniqueKey)}
            readOnly={readOnly}
            value={item.Quantity ?? 0}
          />

          <CustomFormInput
            label="U/A"
            placeholder="U/A"
            onChangeText={val => onOtherFormValueChange((val), "U_M", item.UniqueKey)}
            readOnly={readOnly}
            value={item.U_M ?? 0}
            keyboardType={"default"}
          />

        </View>

        <View style={{ flexDirection: "row" }}>

          <View style={{ width: '100%', flex: 1, marginHorizontal: 4 }}>
            <StyledTextInputLabel>Rate ($)</StyledTextInputLabel>
            <StyledTextInput
              editable={!readOnly && requiredSubCategories.includes(item.Sub_Category)}
              onChangeText={val => {
                onOtherFormValueChange((val), "Rate", item.UniqueKey)
              }}
              value={`${item.Rate}`}
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
            value={item.Scope_Notes ?? ""}
            keyboardType={"default"}
          />
        </View>

        {!readOnly &&
          <StyledSaveButton onPress={() => { item && handleOnSave(false,item); setOverlayVisible(false) }} mode="contained">
            <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: "URBAN_BOLD", fontSize: 18 }}>
              Save
            </Text>
          </StyledSaveButton>}

      </Overlay>
    </>

  )

}


function SubmittedFormLineItem({ status, title, rate, quantity, total, notes, adjQuantity, adjRate, approvedAmt }) {
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


  return (
    // <Card style={{ padding: 16, backgroundColor: getCardBackgroundColor(), borderBottomWidth: 2, borderColor: '#EEBC7B' }}>
    //   <LineItemHeading style={{}}>{title}</LineItemHeading>
    //   <LineItemHeading style={{}}>Scope Notes : {notes}</LineItemHeading>
    //   <View >
    //     {/* Details */}
    //     <View style={{ flexDirection: 'row' }}>
    //       <StyledContractorText style={{ flex: 1, fontSize: 14, }}>QTY: {quantity}</StyledContractorText>
    //       <StyledContractorText style={{ flex: 1, fontSize: 14, }} >RATE: {rate ? rate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
    //       <StyledContractorText style={{ flex: 1, fontSize: 14, }}>TOTAL: {total ? total?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
    //       <StyledContractorButton style={{ fontSize: 16, fontFamily: 'URBAN_BOLD', backgroundColor: getBackgroundColor(), padding: 4 }} mode="contained">{status}</StyledContractorButton>
    //     </View>
    //     <View style={{ flexDirection: 'row', marginTop: 8 }}>
    //       <StyledContractorText style={{ flex: 1, fontSize: 18, }}>ADJ QTY: {showQuantity}</StyledContractorText>
    //       <StyledContractorText style={{ flex: 1, fontSize: 18, }} >RATE: {showRate ? showRate?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
    //       <StyledContractorText style={{ flex: 1, fontSize: 18, }}>TOTAL: {showAmount ? showAmount?.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</StyledContractorText>
    //     </View>
    //   </View>
    // </Card>
    <Card style={{ padding: 12, backgroundColor: getCardBackgroundColor(), borderBottomWidth: 2, borderColor: '#EEBC7B' }}>
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

  )
}

function ContractorViewLineItem({ inspId, isSubmittedByReviewer, handleAcceptLineItem, item, onOtherFormValueChange,setIsEditModalClosed }) {

  const {
    UniqueKey,
    Adj_Quantity,
    Adj_Rate,
    Owner_Clarification,
    Approved_Amount,
    Id: id,
    Matrix_Price: title,
    Rate: rate,
    Quantity: quantity,
    Total: total,
    Approval_Status
  } = item

  //  * GET LINE ITEM IMAGES 
  // TODO - getting all images , select only line item images
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

  useEffect(()=>{
    setIsEditModalClosed(visible)
  },[visible])

  function acceptLineItem() {
    setSelectedStatus("Approved");
    item && handleAcceptLineItem(id, "Approved",item);
  }

  function reviewLineItem() {
    showModal();
  }

  function deleteLineItem() {
    setSelectedStatus("Declined");
    item && handleAcceptLineItem(id, "Declined",item);
  }

  function handleApproveAsNoted() {
    setSelectedStatus("Approved as Noted");
    item && handleAcceptLineItem(id, "Approved as Noted",item);
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


  return (
    <>
      {title && title.length >0 &&  
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
              disabled={Approval_Status==="Approved"}
              backgroundColor={Approval_Status==="Approved" ?"grey":"#7CDD9B"}
              mode="contained"
              onPress={() => acceptLineItem()}>
              A
            </StyledContractorButton>
            <StyledContractorButton
              labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }}
              disabled={Approval_Status==="Approved as Noted"}
              backgroundColor={Approval_Status==="Approved as Noted" ?"grey": "#3983EF"}
              mode="contained"
              onPress={() => reviewLineItem()}>
              R
            </StyledContractorButton>
            <StyledContractorButton
              labelStyle={{ fontSize: 16, fontFamily: 'URBAN_BOLD' }}
              disabled={Approval_Status==="Declined"}
              backgroundColor={Approval_Status==="Declined" ?"grey":"#E02E2E"}
              mode="contained"
              onPress={() => deleteLineItem()}>
              D
            </StyledContractorButton>
          </View>
        </View>
      </Card>
      }
      <Overlay childrenWrapperStyle={{ padding: 18 }} containerStyle={{ backgroundColor: '#dbdad960' }} visible={visible} onClose={() => setVisible(false)} closeOnTouchOutside >
        <Ionicons onPress={() => hideModal()} name="close" size={24} style={{ marginLeft: "auto" }} />
        <GalleryWrapper>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
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
        {/* ADJ QTY, RATE, TOTAL */}
        <View style={{ flexDirection: 'row' }}>
          {/* ADJ QTY */}
          <View style={{ flex: 1, padding: 4 }}>
            <StyledOverlayInputLabel>ADJ QTY</StyledOverlayInputLabel>
            <TextInput
              keyboardType="number-pad"
              onChangeText={text => {
                if (text === "") { // * for negative numbers
                  return onOtherFormValueChange(0, "Adj_Quantity", UniqueKey)
                }
                onOtherFormValueChange(text, "Adj_Quantity", UniqueKey)
              }}
              value={`${Adj_Quantity ?? 0}`}
              style={{ padding: 8, borderRadius: 4, backgroundColor: "#d4d4d470", fontFamily: 'URBAN_MEDIUM', fontSize: 16, color: "#000" }}
            />
          </View>
          {/* ADJ RATE */}
          <View style={{ flex: 1, padding: 4 }}>
            <StyledOverlayInputLabel>ADJ RATE ($)</StyledOverlayInputLabel>
            <TextInput
              keyboardType="number-pad"
              onChangeText={text => {
                if (Platform.OS === 'ios') {
                  return onOtherFormValueChange(text, "Adj_Rate", UniqueKey)
                }
                onOtherFormValueChange(text, "Adj_Rate", UniqueKey)
              }}
              value={`${Adj_Rate ?? 0}`}
              style={{ padding: 8, borderRadius: 4, backgroundColor: "#d4d4d470", fontFamily: 'URBAN_MEDIUM', fontSize: 16, color: "#000" }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {/* ADJ TOTAL */}
          <View style={{ flex: 1, padding: 4 }}>
            <StyledOverlayInputLabel>ADJ TOTAL</StyledOverlayInputLabel>
            <TextInput
              value={`${getCurrencyFormattedValue(Approved_Amount)}` ?? 0}
              editable={false}
              style={{ borderRadius: 4, fontFamily: 'URBAN_MEDIUM', fontSize: 20, color: "#000" }}
            />
          </View>
        </View>


        <View style={{ width: "100%", marginVertical: 8 }}>
          <Text style={{ fontSize: 16, fontFamily: 'URBAN_BOLD', color: '#BDC5CD', marginVertical: 8 }}>OWNER CLARIFICATIONS:</Text>
          <TextInput
            style={{ padding: 16, paddingLeft: 16, borderRadius: 4, backgroundColor: "#d4d4d470", fontFamily: 'URBAN_MEDIUM', fontSize: 16, color: "#000" }}
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
