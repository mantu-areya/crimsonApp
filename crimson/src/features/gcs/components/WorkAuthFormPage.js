
import React, { useEffect, useState, useContext, Component, useRef } from "react";
// import { Row } from "../components/ProcessRecordsInfoCardStyle";
import { Image, View, Modal, Button, ScrollView, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Row, Col } from 'react-native-responsive-grid-system';
import { Dimensions } from 'react-native';
import { InspectionDetailTile } from "./InspectionDetailTile";
import { TotalContainer, InfoTextArea, ActionContainer, HeaderCardCover, BackNavigator, HeaderCard, Body, CarousalScrren } from "./VendorFormPageStyles";
import { ActivityIndicator } from "react-native-paper";
import { InspectionDetailsCard } from "./InspectionDetailsCard"
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { ViewCarousal } from "../../../utilities/ViewCarousalComponent/ViewCarousal";
import { ApprovedItemsForm } from "./ApprovedItemsForm";
import { WorkAuthBidReviewForm } from "../components/WorkAuthBidReviewForm"
import SignatureScreen from "react-native-signature-canvas";
import * as ImagePicker from "expo-image-picker";
import { Button as PaperButton } from "react-native-paper"

const { width, height } = Dimensions.get('window');

const windowWidth = Dimensions.get('window').width;
const IconWidth = .30 * windowWidth;
const BrandIcon = styled(Image)`
resizeMode: stretch;
`
const Loading = styled(ActivityIndicator)`
margin-left: -50%;
`;
const LoadingContainer = styled.View`
margin-top:50%;
`;






export const WorkAuthFormPage = ({ inspectionData, navigation }) => {
  // let [room_Measurement, setRoom_Measurement] = React.useState({ ROOM: [], LENGTH: [], WIDTH: [], MISC_SF: [], TOTAL: [] })
  let [general_Rental, setGeneral_Rental] = React.useState([])
  let [pools, setPools] = React.useState([])
  let [exterior, setExterior] = React.useState([])
  let [interior, setInterior] = React.useState([])
  let [mech_Elec_Plumb, setMech_Elec_Plumb] = React.useState([])
  let [grandTotal, setGrandTotal] = useState(0.00)
  let [showMsg, setShowMsg] = React.useState(false)
  let [approvedItemsData, setApprovedItemsData] = React.useState([])
  let [vendorFormData, setVendorFormData] = React.useState([])
  const { vendorFormDetails, updateToSf,addSignature, contextImages } = useContext(VendorFormContext);
  const [selectedCategory, setSelectedCategory] = React.useState('')
  const [formNum, setFormNum] = React.useState('')
  const [bidReviewSummary, BidReviewSummary] = React.useState({ totalApproved_Amount: 0, approvedItemsCount: 0, grandTotal: 0, totalBidAmount: 0, approvedasNotedAmount: 0, approved_as_Noted_Count: 0, declinedAmount: 0, declined_Count: 0, approved_as_Noted_Count: 0 })
  const [uploadloading,setUploadLoading] = React.useState(false)

  const GetDataByCategory = (inspData) => {
    let approvedItems = [];
    let category1 = [];
    let category2 = [];
    let category3 = [];
    let category4 = [];
    let category5 = [];
    let approvedTotal = 0
    let grandTtl = 0.00;
    let approved_Items_Count = 0;
    let totalBidAmount = 0;
    let approved_as_Noted_Count = 0;
    let approvedasNotedAmount = 0;
    let declined_Count = 0;
    let declinedAmount = 0;

    Object.keys(inspData).map(item => {
      if (inspData[item].Approval_Status === "Approved") {
        approvedTotal += inspData[item].Approved_Amount
        approved_Items_Count += 1
      }
      if (inspData[item].Category === "General Rental Operations Scope") {
        category1.push(inspData[item])
      } else if (inspData[item].Category === "Pools") {
        category2.push(inspData[item])

      } else if (inspData[item].Category === "Exterior") {
        category3.push(inspData[item])

      } else if (inspData[item].Category === "Interior") {
        category4.push(inspData[item])

      } else if (inspData[item].Category === "Mechanical, Electrical and Plumbing Systems") {
        category5.push(inspData[item])

      }
      if (inspData[item].Category !== "Room Measurements") {
        grandTtl = grandTtl + (inspData[item].Total)
      }
      if (inspData[item].Approval_Status === "Declined") {
        declinedAmount += inspData[item].Approved_Amount
        declined_Count += 1
      }
      if (inspData[item].Quantity > 0) {
        totalBidAmount += inspData[item].Total
      }
      if (inspData[item].Approval_Status === "Approved as Noted") {
        approvedasNotedAmount += inspData[item].Approved_Amount
        approved_as_Noted_Count += 1
      }

      if (inspData[item].Approval_Status === "Approved" || inspData[item].Approval_Status === "Approved as Noted") {
        approvedItems.push(inspData[item])
      }

      if(inspData[item].signature ){
        setImg(inspData[item].signature);
      }
    })
    setApprovedItemsData(approvedItems);
    setGeneral_Rental(category1);
    setPools(category2);
    setExterior(category3);
    setInterior(category4);
    setMech_Elec_Plumb(category5);
    setGrandTotal(grandTtl)
    setVendorFormData(inspData)
    BidReviewSummary({ ...bidReviewSummary, ["totalApproved_Amount"]: approvedTotal, ["approvedItemsCount"]: approved_Items_Count, ["grandTotal"]: grandTtl, ["totalBidAmount"]: totalBidAmount, ["approvedasNotedAmount"]: approvedasNotedAmount, ["approved_as_Noted_Count"]: approved_as_Noted_Count, ["declined_Count"]: declined_Count, ["declinedAmount"]: declinedAmount })
  }






const updateSignToContext = (image)=>{
    addSignature(inspectionData.Id,image)
}

  useEffect(() => {
    let contexRecord = vendorFormDetails[inspectionData.Id]
    if (contexRecord) {
      if (inspectionData.doCreateWAF__c == false) {
        setShowMsg(true)
      }
      else {
        GetDataByCategory(contexRecord)
      }
    }
  }, [vendorFormDetails]);


useEffect(()=>{
  contextImages[inspectionData.Id] && contextImages[inspectionData.Id].map(ele=>{
    if (ele.file_name ==  "Contractor signature.jpeg") {
    console.log(ele.file_public_url,"vfvfvfv"); 
    setImg(ele.file_public_url)
    return
  }
  })
},[contextImages])


  const renderNoVFText = () => {
    return <InfoTextArea>
      <Text variant="DataNotFoundTitle" > WORK AUTHORISATION FORM HAS NOT BEEN GENERATED FOR THIS RECORD</Text>
    </InfoTextArea>
  }


  const [img, setImg] = React.useState(null)

  const [modalVisible, setModalVisible] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false)

  const uploadImage = async () => {

    try {

      // setIsLoading(true);


      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });

      result = result.base64

      if(result){
        console.log(result,"kkk");
        // setImg(result);
        updateSignToContext(result)
        setIsLoading(true);
      }


    } catch (error) {

      setIsLoading(false);
      console.log(error);
      alert('Upload Error' + error)

    }

  }


  return (<>

    <SafeArea>
      <ScrollView keyboardDismissMode={'on-drag'} >

        <Body>
          <Spacer position="top" size="medium" />


          {showMsg ? renderNoVFText() :
           <>
            <WorkAuthBidReviewForm bidReviewSummary={bidReviewSummary} />
            <Spacer position="top" size="large" />
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            </View>
                <ApprovedItemsForm approvedItems={approvedItemsData} />
                <View style={{ flexDirection: "row" }}>
                  {/* Contractor Signature */}
                  <View style={{ padding: 16, flex: .5 }}>
                    <Text style={{ fontSize: 12 }}>Contractor Signature</Text>
                    {console.log(img,"miggg")}
                    {img ?
                      <View style={{ justifyContent: 'center', marginVertical: 8, padding: 4 }}>
                        <Image
                        accessibilityLabel="Signature Image"
                        style={{
                          width: 80,
                          height: 80
                        }} source={{ uri: img }} />
                      </View>:isLoading &&<Loading size={40} animating={true} color={"black"} />}
                     {img && <Text style={{ fontSize: 12 }}>Date : {new Date().toDateString()}</Text>}
                    {!img && <>
                      <PaperButton style={{
                        backgroundColor: 'black',
                        color: "white",
                        marginVertical: 2,
                        marginTop:4,
                        width: 100,
                        fontSize:28
                      }} mode="contained" onPress={() => setModalVisible(true)}>
                        Sign
                      </PaperButton>
                      <PaperButton style={{
                        backgroundColor: 'black',
                        color: "white",
                        marginVertical: 2,
                        width: 100,
                      }} loading={isLoading} mode="contained" onPress={uploadImage}>
                        Upload
                      </PaperButton>
                    </>}
                    {/* <Button title="Sign"  /> */}
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => {
                        setModalVisible(!modalVisible);
                      }}>

                      <Sign onOK={(e) => {
                        let bs64dataArray = e.split(',')
                        setImg(e);
                        setModalVisible(!modalVisible);
                        updateSignToContext(bs64dataArray[1])
                        setIsLoading(true);
                      }} text='Contractor Sign' />


                    </Modal>

                  </View>
                  {/* HHM Signature */}
                  <View style={{ padding: 16, flex: .5,alignItems:"flex-end" }}>
                    <Text style={{ fontSize: 12 }}>HHM Signature</Text>
                    {/* {img &&
                      <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginVertical: 8, padding: 4 }}>
                        <Image style={{
                          width: 80,
                          height: 80
                        }} source={{ uri: img }} />
                      </View>}
                    <Text style={{ fontSize: 12 }}>Date : {new Date().toDateString()}</Text> */}
                  </View>
                </View>
              <CarousalScrren >
                {formNum == 1 && <WorkAuthOtherForms catName={"GENERAL RENTAL OPERATIONS SCOPE"} formData={general_Rental} inspId={inspectionData.Id} />}
              </CarousalScrren >
              <CarousalScrren >
                {formNum == 2 && <WorkAuthOtherForms catName={"Pools"} formData={pools} inspId={inspectionData.Id} />}
              </CarousalScrren >
              <CarousalScrren >
                {formNum == 3 && <WorkAuthOtherForms catName={"Exterior"} formData={exterior} inspId={inspectionData.Id} />}
              </CarousalScrren>
              <CarousalScrren >
                {formNum == 4 && <WorkAuthOtherForms catName={"Interior"} formData={interior} inspId={inspectionData.Id} />}
              </CarousalScrren>
              <CarousalScrren >
                {formNum == 5 && <WorkAuthOtherForms catName={"Mechanical, Electrical and Plumbing Systems"} formData={mech_Elec_Plumb} inspId={inspectionData.Id} />}
              </CarousalScrren>
              {console.log(inspectionData.Id)}
          </>}
        </Body>
      </ScrollView>
    </SafeArea>
  </>
  )
}


const Sign = ({ text, onOK }) => {
  const ref = React.useRef();

  const handleSignature = signature => {
    onOK(signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  }

  const handleClear = () => {
    console.log('clear success!');
  }

  const handleEnd = () => {
    ref.current.readSignature();
  }

  const handleBegin = () => {
    console.log('begin!');
  };

  return (
    <View style={styles.container}>
      <SignatureScreen
        ref={ref}
        onEnd={handleEnd}
        onOK={handleSignature}
        onEmpty={handleEmpty}
        onClear={handleClear}
        onBegin={handleBegin}
        autoClear={false}
        descriptionText={text}
        backgroundColor={"white"}
        penColor={"rgba(0,0,0)"}
        imageType="image/jpeg"
        minWidth={1}
        overlayHeight="100%"
        showImage={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    height: 600
  },
});