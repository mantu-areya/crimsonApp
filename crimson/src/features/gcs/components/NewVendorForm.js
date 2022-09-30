
import React, { useEffect, useState, useContext, Component, useRef } from "react";
// import { Row } from "../components/ProcessRecordsInfoCardStyle";
import { Image, View, ScrollView, TouchableOpacity, StyleSheet, Pressable, SafeAreaView, FlatList, TextInput } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import styled from "styled-components/native";
import { Text } from "../../../components/typography/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Row, Col } from 'react-native-responsive-grid-system';
import { Dimensions } from 'react-native';
import { InspectionDetailTile } from "./InspectionDetailTile";
import { RoomForm } from "./RoomForm";
import { OtherCategoryForms } from "./OtherCategoryForms";
import { ActivityIndicator } from "react-native-paper";
import { InspectionDetailsCard } from "./InspectionDetailsCard"
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { ViewCarousal } from "../../../utilities/ViewCarousalComponent/ViewCarousal";
import { useIsFocused } from '@react-navigation/native';
const backIcon = <Icon name="arrow-left" size={12} />;
import { Button, Chip, IconButton } from "react-native-paper";
import { TotalContainer, InfoTextArea, ActionContainer, HeaderCardCover, BackNavigator, HeaderCard, Body, CarousalScrren, TextArea, Camerabutton } from "../components/VendorFormPageStyles";
import { WorkAuthFormPage } from "../components/WorkAuthFormPage";
import RoomMeasurement from "./detailsView/RoomMeasurement";
import OtherFormTabMenu from "./otherForms/OtherFormTabMenu";


const { width, height } = Dimensions.get('window');








const windowWidth = Dimensions.get('window').width;
const IconWidth = .30 * windowWidth;

const Loading = styled(ActivityIndicator)`
  margin-left: -25px;
`;
const LoadingContainer = styled.View`
margin-top:50%;
`;





export const NewVendorForm = ({ inspectionData, readOnly,navigation }) => {
    let [general_Rental, setGeneral_Rental] = React.useState([])
    let [pools, setPools] = React.useState([])
    let [exterior, setExterior] = React.useState([])
    let [interior, setInterior] = React.useState([])
    let [mech_Elec_Plumb, setMech_Elec_Plumb] = React.useState([])
    let [grandTotal, setGrandTotal] = useState(0.00)
    let [room_MeasurementData, setRoom_MeasurementData] = React.useState([])
    const { vendorFormDetails, updateToSf} = useContext(VendorFormContext);


    const isFocused = useIsFocused();


    const GetDataByCategory = (inspData) => {
        let room_msrmnt = []
        let category1 = []
        let category2 = []
        let category3 = []
        let category4 = []
        let category5 = []
        let grandTtl = 0.00;

        Object.keys(inspData).map(item => {
            if (inspData[item].Category === "Room Measurements") {
                room_msrmnt.push(inspData[item])
            }
            else if (inspData[item].Category === "General Rental Operations Scope") {
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

        })
        setRoom_MeasurementData(room_msrmnt);
        setGeneral_Rental(category1);
        setPools(category2);
        setExterior(category3);
        setInterior(category4);
        setMech_Elec_Plumb(category5);
        setGrandTotal(grandTtl)
    }


    useEffect(() => {
        let contexRecord = vendorFormDetails[inspectionData.Id]
        if (contexRecord) {
            if (contexRecord == "NA") {
                // setShowMsg(true)
            }
            else {
                GetDataByCategory(contexRecord)
            }
        }
    }, [vendorFormDetails]);


    const formsData = {
        'General Rental Operations Scope': general_Rental,
        'Pools': pools,
        'Exterior': exterior,
        'Interior': interior,
        'Mechanical, Electrical and Plumbing Systems': mech_Elec_Plumb,
    }

    console.log("ID",inspectionData.Id);

    useEffect(() => {
        isFocused == false && updateToSf(inspectionData.Id)
      }, [isFocused])

      if (readOnly) {
       return <View>
            <Text style={{color: "white", fontFamily: 'SF_BOLD' }}>Vendor Form is submitted</Text>
        </View>
      }

    return (<>

        <SafeArea>
            <RoomMeasurement room_Measurement={room_MeasurementData} inspId={inspectionData.Id} />
            <OtherFormTabMenu formsData={formsData} inspId={inspectionData.Id} grandTotal={grandTotal}  navigation={navigation}/>
        </SafeArea>
    </>
    )
}


